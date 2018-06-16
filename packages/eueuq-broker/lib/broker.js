'use strict';

/**
 * Module dependencies
 */
const debug = require('debug')('eueuq:broker');
const uuidv1 = require('uuid/v1');

const Config = require('eueuq-core').Config;
const Action = require('eueuq-core').Action;
const ChannelServer = require('eueuq-core').ChannelServer;

/**
 * Message broker
 *
 * @param {Object} config A configuration Object
 */
module.exports = function Broker(config) {
  const _config = Config(config, process.env);
  const _uri = _config.connectionUri;
  const _server = new ChannelServer();

  // Static
  return {

    /**
     * Get encyption cipher
     *
     * @return {Strign} A cipher
     */
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
