'use strict';

/**
 * Module dependencies
 */
const uuidv4 = require('uuid/v4');

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
    this.id = uuidv4();
  }

  /**
   * Internal debug logging
   *
   */
  _debug(message) {

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
      this._debug(`Connected channel`);

      socket.on('data', (buffer) => {
        this._debug(`Received data ${buffer.length}`);
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
          this._debug(`Message collected`);
          completedList = _bufferList;
          completedList.push(lastBuf);
          _channel.onMessage(Buffer.concat(completedList));

          _bufferList = [];
        }

        _bufferList.push(nextBuf);
      });
      socket.on('error', (err) => {
        this._debug(`Encountered error: ${err.message}`);
        _bufferList = [];
        _channel.onError(err);
      });
      socket.on('end', () => {
        this._debug(`Disconnected`);
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
