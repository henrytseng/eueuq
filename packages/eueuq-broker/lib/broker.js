/**
 * Module dependencies
 */
const debug = require('debug')('eueuq:broker');
const uuidv1 = require('uuid/v1');

const Config = require('eueuq-core').Config;
const Action = require('eueuq-core').Action;
const ConnectionStream = require('eueuq-core').ConnectionStream;

/**
 * A factory method to produce message brokers
 *
 * @param {Object} config A configuration Object
 */
module.exports = function Broker(config) {
  const _config = Config(config, process.env);
  const _uri = _config.connectionUri;

  // Internal factory method
  function _brokerReproducer() {

    // Instance
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
       * Receive from incoming channel streams
       *
       * @return {ChannelStream} A message stream
       */
      messages: () => {
        return ConnectionStream(_uri.port, _uri.hostname);
      },

      /**
       * Send outgoing
       *
       * @param  {Object} message A data Object payload describing an action
       * @return {Broker}         A Broker, chainable method
       */
      send: (message) => {
        let _message = Object.assign({}, message);
        _message.id = uuidv1();
        _message.sentAt = new Date();
        Action.createWithMessage(_message).execute();
        return _brokerReproducer();
      }

    };
  }

  return _brokerReproducer();
};
