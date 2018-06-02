'use strict';

/**
 * Module dependencies
 */
const uuidv1 = require('uuid/v1');
const debug = require('debug')('eueuq:core');

const ConnectionError = require('../errors/connection-error');

const DEFAULT_EOL = "\n";

/**
 * Channel
 *
 * Aggregates data into messages
 */
class Channel {

  /**
   * Constructor
   */
  constructor() {
    this.id = uuidv1();
  }

  /**
   * Internal method to register with socket
   *
   * @return {Function} A handler function(socket) to which registers received socket
   */
  _createRegisterMethod() {
    let _channel = this;

    /**
     * A buffer aggregation
     *
     * @param  {net.Socket} socket A network socket
     */
    return (socket) => {
      let _bufferList = [];

      _channel.socket = socket;
      _channel.onConnect();
      debug(`[${this.id}] Connected channel`);

      socket.on('data', (buffer) => {
        debug(`[${this.id}] Received data ${buffer.length}`);
        let i;
        let k;
        let lastBuf;
        let nextBuf = buffer;
        let completedList;

        // Limit looping for debugging
        for(k=0; (i=nextBuf.indexOf(Channel.EOL, 'utf8')) !== -1; k++) {
          lastBuf = nextBuf.slice(0, i);
          nextBuf = nextBuf.slice(i + Channel.EOL.length);

          // Finish last
          debug(`[${this.id}] Message collected`);
          completedList = _bufferList;
          completedList.push(lastBuf);
          _channel.onMessage(Buffer.concat(completedList));

          _bufferList = [];
        }

        _bufferList.push(nextBuf);
      });
      socket.on('error', (err) => {
        debug(`[${this.id}] Encountered error: ${err.message}`);
        _bufferList = [];
        _channel.onError(err);
      });
      socket.on('end', () => {
        debug(`[${this.id}] Disconnected`);
        _bufferList = [];
        _channel.onEnd();
      });
    };
  }

  /**
   * Send message
   */
  send() {
    if(!this._channel.socket) throw new ConnectionError('Unable to send data no socket established');
  }

  /**
   * Handler for connection ready
   */
  onConnect() {
  }

  /**
   * Handler for message
   *
   * @param  {Object} message A message data Object
   */
  onMessage(message) {

  }

  /**
   * Handler for connection ready
   */
  onError(error) {
  }

  /**
   * Handler for connection ready
   */
  onEnd() {
  }

}

Channel.EOL = DEFAULT_EOL;

module.exports = Channel;
