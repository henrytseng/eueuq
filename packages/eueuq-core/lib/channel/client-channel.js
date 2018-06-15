'use strict';

/**
 * Module dependencies
 */
const net = require('net');
const debug = require('debug')('eueuq:core:channel:client');

const Channel = require('./index');

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
   * Decorate debugger with origin identification
   *
   * @param  {String} message A message payload
   */
  _debug(message) {
    debug(`[${this.id}] ${message}`);
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
      this._debug(`Existing connection unable alreday started ${host}:${port}`);
      return false;
    }

    this._debug(`Connecting`);
    this._connection = net.createConnection({
      host: host,
      port: port
    }, () => {
      this._debug(`Connection established ${host}:${port}`);

    });
  }

  disconnect() {
    this._debug(`Disconnecting`);
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
