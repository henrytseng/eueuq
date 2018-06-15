'use strict';

/**
 * Module dependencies
 */
const net = require('net');
const debug = require('debug')('eueuq:core:channel:client');

const Channel = require('./index');

/**
 * Decorate debugger with origin identification
 *
 * @param  {String} message A message payload
 */
const _debugInfo = (message) => {
  debug(`[${this.id}] ${message}`);
};

/**
 * Channel representation on client side of connection with server
 *
 * @extends Channel
 */
class ClientChannel extends Channel {

  constructor() {
    super();
  }

  /**
   * Connect to a ServiceChannel
   *
   * @param  {Number}  port A port
   * @param  {String}  host A hostname
   * @return {Boolean}      True if successful started connecting
   */
  connect(port, host) {
    if(this._connection) {
      _debugInfo(`Existing connection unable alreday started ${host}:${port}`);
      return false;
    }

    _debugInfo(`Connecting`);
    this._connection = net.createConnection({
      host: host,
      port: port
    }, () => {
      _debugInfo(`Connection established ${host}:${port}`);

    });
  }

  disconnect() {
    _debugInfo(`Disconnecting`);
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

}

module.exports = ClientChannel;
