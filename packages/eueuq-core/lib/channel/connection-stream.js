/**
 * Module dependencies
 */
const net = require('net');
const debug = require('debug')('eueuq:core:channel:service');
const uuidv4 = require('uuid/v4');
const { Subject, fromEvent } = require('rxjs');
const { filter, delay, take } = require('rxjs/operators');

const MessageStream = require('./message-stream');
const signalInterupt = require('../shutdown/signal-interupt');

const MAX_RETRY_LISTENING = 5;
const RETRY_DELAY = 1000;

/**
 * A factory method for channel streams
 */
module.exports = function ConnectionStream(port, host) {
  const _id = uuidv4();
  const _channelStream = new Subject();

  /**
   * Internal debug method
   *
   * @param  {String} message A message payload
   */
  function _debug(message) {
    return debug(`[${_id}] ${message}`);
  }

  // Server instance
  const _server = net.createServer((socket) => {
    _debug(`Connected channel`);
    _channelStream.next(MessageStream(socket));
  });

  /**
   * Start listening
   */
  function _startListening() {
    _server.listen(port, host, () => {
      _debug(`Listening on port ${port}`);
    });
  }

  // Server error
  const _retryAttempt = (new Subject()).pipe(delay(RETRY_DELAY), take(MAX_RETRY_LISTENING));
  const _serverErrorStream = fromEvent(_server, 'error').pipe(filter((err) => err.code == 'EADDRINUSE'));

  _serverErrorStream.subscribe((err) => {
    _debug(`Encountered error acquiring port:${port}`);
    _retryAttempt.next(err);
  });

  // Attempt retry
  _retryAttempt.subscribe(() => {
    _startListening();
  });

  // Graceful shutdown
  signalInterupt.subscribe(() => {
    _server.close();
  });

  _startListening();

  return _channelStream;
};
