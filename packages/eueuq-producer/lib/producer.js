'use strict';

/**
 * Module dependencies
 */
const { URL } = require('url');
const net = require('net');
const debug = require('debug')('eueuq:producer');
const EventEmitter = require('events');

const Config = require('eueuq-core').Config;
const ClientChannel = require('eueuq-core').ClientChannel;
const ConfigurationError = require('eueuq-core').errors.ConfigurationError;
const shutdownManager = require('eueuq-core').shutdownManager;

const EUEUQ_CIPHER_KEY = process.env.EUEUQ_CIPHER_KEY;
const EUEUQ_BROKER_URI = process.env.EUEUQ_BROKER_URI;

/**
 * Message producer
 */
module.exports = function Producer(config) {
  const _config = Config(config, process.env);
  const _uri = _config.connectionUri;
  const _channel = new ClientChannel();

  // Static
  return {

    /**
     * Start connection with broker
     */
    connect: () => {
      _channel.connect(_uri.port, _uri.hostname);
    },

    /**
     * Disconnect from broker
     */
    disconnect: () => {
      _channel.disconnect();
    }
  };
};
