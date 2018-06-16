'use strict';

/**
 * Module dependencies
 */
const { URL } = require('url');
const uuidv1 = require('uuid/v1');
const debug = require('debug')('eueuq:broker');
const EventEmitter = require('events');

const Action = require('eueuq-core').Action;
const ChannelServer = require('eueuq-core').ChannelServer;

const EUEUQ_CIPHER_KEY = process.env.EUEUQ_CIPHER_KEY;
const EUEUQ_BROKER_URI = process.env.EUEUQ_BROKER_URI;

/**
 * Message broker
 *
 * @param {Object} config A configuration Object
 */
module.exports = function Broker(config) {

  // Config
  const _config = Object.assign({
    cipherKey: EUEUQ_CIPHER_KEY,
    connectionUri: EUEUQ_BROKER_URI || 'eueuq://localhost:5031'
  }, config || {});

  const _uri = new URL(_config.connectionUri);
  const _server = new ChannelServer();

  // Static instance
  return {

    getCipherKey: () => {
      return _config.cipherKey;
    },

    /**
     * Start brokering service
     */
    listen: () => {
      _server.listen(_uri.port, _uri.hostname);
    },

    /**
     * Perform an action
     *
     * @param  {Object} message A data Object payload describing an action
     * @return                  A data Object sent
     */
    perform: (message) => {
      let _message = Object.assign({}, message);
      _message.id = uuidv1();
      _message.sentAt = new Date();
      let _action = Action.createWithMessage(_message).execute();
      return _message;
    },

    /**
     * Close service
     */
    close: () => {
      _server.close();
    }
  };
};
