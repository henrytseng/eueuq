'use strict';

/**
 * Module dependencies
 */
const { URL } = require('url');
const net = require('net');
const debug = require('debug')('eueuq:producer');
const EventEmitter = require('events');

const ChannelFactory = require('eueuq-core').ChannelFactory;
const ConfigurationError = require('eueuq-core').errors.ConfigurationError;
const params = require('parametr');
const shutdownManager = require('eueuq-core').shutdownManager;

/**
 * Message producer
 */
class Producer extends EventEmitter {

  /**
   * Constructor
   *
   * @param {String} connectionUri A connection URI value
   * @param {Object} [config]      A optional configuration Object
   */
  constructor(connectionUri, config) {
    super();
    this._config = params(config || {})
      .require('cipherKey');
    this._uri = connectionUri;
    this._connection = null;

    if(!this._uri) throw new ConfigurationError('A connection URI is needed.');
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

module.exports = Producer;
