'use strict';

/**
 * Module dependencies
 */
const { URL } = require('url');
const net = require('net');
const debug = require('debug')('eueuq:consumer');
const EventEmitter = require('events');

const ChannelFactory = require('eueuq-core').ChannelFactory;
const shutdownManager = require('eueuq-core').shutdownManager;

/**
 * Message consumer
 */
class Consumer extends EventEmitter {

  /**
   * Constructor
   *
   * @param {String} connectionUri A connection URI value
   * @param {Object} [config]      A optional configuration Object
   */
  constructor(connectionUri, config) {
    super();
    this._config = config || {};
    this._uri = connectionUri;
    this._connection = null;
    this._createChannel = ChannelFactory.buildCreateMethod(this, 'client');
  }

  connect() {
    if(!this._channel) {
      this._channel.open();
    }
  }

  disconnect() {
    if(!this._channel) {
      this._channel.close();
    }
  }
}
