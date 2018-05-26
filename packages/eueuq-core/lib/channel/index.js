'use strict';

/**
 * Module dependencies
 */
const debug = require('debug')('eueuq:core');

const EOL = "\n";

/**
 * Channel
 */
class Channel {

  /**
   * Constructor
   *
   * @param {Broker} service A broker
   * @param {String} type    A channel type
   */
  constructor(service, type) {
    this._service = service;
    this._type = type;
    this.id = null;
    this.direction = null;
  }

  /**
   * Internal method to register with socket
   *
   * @return {Function} A handler function(socket) to which registers received socket
   */
  _registerSocket() {
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
        for(k=0; (i=nextBuf.indexOf(EOL, 'utf8')) !== -1; k++) {
          lastBuf = nextBuf.slice(0, i);
          nextBuf = nextBuf.slice(i + EOL.length);

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
        _channel.onError();
      });
      socket.on('end', () => {
        debug(`[${this.id}] Disconnected`);
        _channel.onEnd();
      });
    };
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

module.exports = Channel;
