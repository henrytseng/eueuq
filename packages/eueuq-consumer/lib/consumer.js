'use strict';

/**
 * Module dependencies
 */
const debug = require('debug')('eueuq:consumer');

const Config = require('eueuq-core').Config;
const ClientChannel = require('eueuq-core').ClientChannel;

/**
 * Message consumer
 */
module.exports = function Consumer(config) {
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
