'use strict';

/**
 * Module dependencies
 */
const net = require('net');
const debug = require('debug')('eueuq:core:channel:service');
const uuidv4 = require('uuid/v4');

const ServiceChannel = require('./service-channel');
const shutdownManager = require('../shutdown/shutdown-manager');
const ConnectionError = require('../errors/connection-error');

const MAX_RETRY_LISTENING = 5;

/**
 * A server to receive channel socket connections
 */
class ChannelServer {

  /**
   * Constructor
   */
  constructor() {
    this._channelCollection = new Map();
    this.id = uuidv4();
  }

  /**
   * Decorate debugger with origin identification
   *
   * @param  {String} message A message payload
   */
  _debug(message) {
    debug(`[${this.id}] ${message}`);
  }

  /**
   * Internal method to add channel
   *
   * @return {ServiceChannel} A registered channel
   */
  _createChannel() {
    let channel = new ServiceChannel();
    this._debug(`Adding channel[${channel.id}]`);
    this._channelCollection.set(channel.id, channel);
    return channel;
  }

  /**
   * Internal method to remove channel
   *
   * @param  {ServiceChannel} channel [description]
   */
  _destroyChannel(channel) {
    let channelId = channel.id;
    if(!this._channelCollection.has(channelId)) {
      this._debug(`Unable to destroy channel[${channelId}] is not registered`);
      return false;
    }
    this._debug(`Removing channel[${channelId}]`);
    this._channelCollection.delete(channelId);
    return true;
  }

  /**
   * Set up listening
   *
   * @param  {Number}  port   A port
   * @param  {String}  [host] A hostname
   * @return {Boolean}        True if successful started listening
   */
  listen(port, host) {
    if(this._server) {
      this._debug(`Existing server unable to start listening on port ${host}:${port}`);
      return false;
    }

    this._server = net.createServer((socket) => {
      let _channel = this._createChannel();
      let _registerMethod = _channel._createRegisterMethod();
      let _unregisterMethod = this._destroyChannel.bind(this, _channel);
      socket.once('end', _unregisterMethod);
      socket.once('error', _unregisterMethod);
      _registerMethod(socket);
    });
    let _startListening = () => {
      clearTimeout(this._startServerRetryTimeout);
      this._server.listen(port, host, () => {
        this._debug(`Listening on port ${port}`);
      });
    };

    // Retry attempt
    let _attemptCount = 0;
    this._server.on('error', (e) => {
      if (e.code == 'EADDRINUSE') {
        _attemptCount++;
        if(_attemptCount >= MAX_RETRY_LISTENING) {
          throw new ConnectionError(`Unable to establish listen port:${port}`);
        } else {
          this._debug(`Address in use retrying port:${port}`);
          this._startServerRetryTimeout = setTimeout(_startListening, 1000);
        }
      } else {
        this._debug(`Encountered error acquiring port:${port}`);
      }
    });

    // Attempt graceful SIGINT shutdown
    shutdownManager.on('attempted', () => { this.close(); });

    _startListening();
    return true;
  }

  /**
   * Close service
   */
  close() {
    this._debug(`Closing service`);
    clearTimeout(this._startServerRetryTimeout);
    if(!this._server) {
      this._debug(`Unable able to close; not listening`);
      return false;
    }

    this._server.close();
    this._server = null;
    return true;
  }

}

module.exports = ChannelServer;
