'use strict';

/**
 * Module dependencies
 */
const { URL } = require('url');
const net = require('net');
const debug = require('debug')('eueuq:producer');
const EventEmitter = require('events');

const ClientChannel = require('eueuq-core').ClientChannel;
const ConfigurationError = require('eueuq-core').errors.ConfigurationError;
const shutdownManager = require('eueuq-core').shutdownManager;

const EUEUQ_CIPHER_KEY = process.env.EUEUQ_CIPHER_KEY;
const EUEUQ_BROKER_URI = process.env.EUEUQ_BROKER_URI;

/**
 * Message producer
 */
class Producer extends EventEmitter {

  /**
   * Constructor
   *
   * @param {Object} config A configuration Object
   */
  constructor(config) {
    super();
    this._config = config || {};
    this._config = Object.assign({
      cipherKey: EUEUQ_CIPHER_KEY,
      connectionUri: EUEUQ_BROKER_URI || 'eueuq://localhost:5031'
    }, this._config);
    this._uri = new URL(this._config.connectionUri);
    this._channel = new ClientChannel();

    if(!this._uri) throw new ConfigurationError('A connection URI is needed.');
  }

  connect() {
    this._channel.connect(this._uri.port, this._uri.hostname);
  }

  disconnect() {
    this._channel.disconnect();
  }
}

module.exports = Producer;
