/**
 * Module dependencies
 */
const net = require('net');
const debug = require('debug')('eueuq:core:channel:connections');
const uuidv4 = require('uuid/v4');
const { Subject, fromEvent } = require('rxjs');
const { filter, delay, take } = require('rxjs/operators');

const MessageStream = require('./message-stream');
const signalInterupt$ = require('../shutdown/signal-interupt');

const MAX_RETRY_LISTENING = 5;
const RETRY_DELAY = 1000;

/**
 * A conduit for message streams
 *
 * @param {Number} port       A port number
 * @param {String} [hostname] A optional hostname
 * @return
 */
module.exports = function Channel(port, hostname) {
  const _serverId = uuidv4();
  const _connection$ = new Subject();

  /**
   * Internal debug method
   *
   * @param  {String} message A message payload
   */
  function _debug(message) {
    return debug(`[${_serverId}] ${message}`);
  }

  // Server instance
  const _server = net.createServer((socket) => {
    _debug(`Connected channel`);
    _connection$.next(MessageStream(socket));
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
    _server.unref();
    _server.close();
  }

  // Server errors
  const _serverError$ = fromEvent(_server, 'error')
    .pipe(filter((err) => err.code == 'EADDRINUSE'));

  // Retry attempts
  const _retryAttempt$ = (new Subject())
    .pipe(delay(RETRY_DELAY), take(MAX_RETRY_LISTENING));
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
