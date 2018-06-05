'use strict';

/**
 * Module dependencies
 */
const net = require('net');
const debug = require('debug')('eueuq:core');

const Channel = require('./index');
const shutdownManager = require('eueuq-core').shutdownManager;

class ServiceChannel extends Channel {

  /**
   * Constructor
   */
  constructor() {
    super();
    this._server = null;
    this._channels = new Set();
  }

  /**
   * Internal method to add channel
   *
   * @return {ServiceChannel} A registered channel
   */
  _createChannel() {
    let channel = new ServiceChannel();
    debug(`Service[${this.id}] Adding channel[${channel.id}]`);
    this._channels.add(channel);
    return channel;
  }

  /**
   * Internal method to remove channel
   *
   * @param  {ServiceChannel} channel [description]
   */
  _destroyChannel(channel) {
    debug(`Service[${this.id}] Removing channel[${channel.id}]`);
    if(this._channels.has(channel)) this._channels.delete(channel);
  }

  listen(port) {
    debug(`Service[${this.id}] Listening on port ${port}`);
    if(this._server) {
      this._server = net.createServer((socket) => {
        let _channel = this._createChannel();
        let _registerMethod = _channel._createRegisterMethod();
        let _unregisterMethod = this._destroyChannel.bind(this);
        socket.once('end', _unregisterMethod);
        socket.once('error', _unregisterMethod);
        _registerMethod(socket);
      });
      this._server.listen(port);
      shutdownManager.on('attempted', () => { this.close(); });
    } else {
      debug(`Service[${this.id}] Existing server unable to start listening on port ${port}`);
    }
  }

  /**
   * Send message
   */
  send() {

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
   * Close service
   */
  close() {
    debug(`Service[${this.id}] Disconnecting`);
    if(this._server) {
      this._server.close();
      this._server = null;
    } else {
      debug(`Service[${this.id}] Unable able to close; not listening`);
    }
  }
}

module.exports = ServiceChannel;
