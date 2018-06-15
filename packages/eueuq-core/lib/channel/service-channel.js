'use strict';

/**
 * Module dependencies
 */
const net = require('net');
const debug = require('debug')('eueuq:core:channel:service');

const Channel = require('./index');

/**
 * Channel representation on service side of connection with client
 *
 * @extends Channel
 */
class ServiceChannel extends Channel {

  /**
   * Constructor
   */
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

module.exports = ServiceChannel;
