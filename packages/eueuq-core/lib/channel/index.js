/**
 * Module dependencies
 */
const net = require('net');
const debug = require('debug')('eueuq:core:channel:connections');
const uuidv4 = require('uuid/v4');
const { Subject, fromEvent } = require('rxjs');
const { filter, delay, take } = require('rxjs/operators');

const IncomingStream = require('./incoming-stream');
const OutgoingStream = require('./outgoing-stream');
const signalInterupt$ = require('../shutdown/signal-interupt');
const Config = require('../config');

/**
 * A conduit for message streams
 *
 * @param {Number} port       A port number
 * @param {String} [hostname] A optional hostname
 * @param {Config} [config]   A configuration object
 * @return
 */
module.exports = function Channel(port, hostname, config) {
  const _channelId = uuidv4();
  const _connection$ = new Subject();
  const _config = Config(config, process.env);
  let _retryAttempt$;

  const MAX_SERVER_RETRY_LISTENING = _config.maxServerRetryAttempt || 5;
  const SERVER_RETRY_DELAY = _config.serverRetryDelay || 1000;

  /**
   * Internal debug method
   *
   * @param  {String} message A message payload
   */
  function _debug(message) {
    return debug(`[${_channelId}] ${message}`);
  }

  // Server instance
  const _server = net.createServer((socket) => {
    _debug(`Connected channel`);
    _connection$.next({
      _socket: socket,
      incoming$: IncomingStream(socket, _channelId, _config),
      outgoing$: OutgoingStream(socket, _channelId, _config)
    });
  });

  /**
   * Start listening
   */
  function _startListening() {
    _server.listen(port, hostname, () => {
      hostname = hostname || 'localhost';
      _debug(`Listening on ${hostname}:${port}`);
    });
  }

  /**
   * Stop server
   */
  function _stopListening() {
    _debug('Closing channel');
    _server.unref();
    _server.close();
    _connection$.complete();
    _retryAttempt$.complete();
  }

  // Server errors
  const _serverError$ = fromEvent(_server, 'error')
    .pipe(filter((err) => err.code == 'EADDRINUSE'));

  // Retry attempts
  _retryAttempt$ = (new Subject())
    .pipe(delay(SERVER_RETRY_DELAY), take(MAX_SERVER_RETRY_LISTENING));
  _serverError$.subscribe((err) => {
    _debug(`Encountered error acquiring port:${port}`);
    _retryAttempt$.next(err);
  });

  // Attempt retry
  _retryAttempt$.subscribe(() => {
    _startListening();
  });

  // Graceful shutdown
  signalInterupt$.subscribe(() => {
    _stopListening();
  });

  return {

    id: _channelId,

    listen: _startListening,

    /**
     * Connection stream subject
     *
     * @return {Observable<MessageStream>} A connection stream
     */
    connection$: () => {
      return _connection$;
    },

    close: _stopListening
  };
};
