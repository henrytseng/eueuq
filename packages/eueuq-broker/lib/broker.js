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
 */
class Broker extends EventEmitter {

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
    this._server = new ChannelServer();
  }

  /**
   * Internal method to retrieve cipher key
   *
   * @return {String} A key
   */
  _getCipherKey() {
    return this._config.cipherKey;
  }

  /**
   * Start brokering service
   */
  listen() {
    this._server.listen(this._uri.port, this._uri.hostname);
  }

  /**
   * Perform an action
   *
   * @param  {Object} message A data Object payload describing an action
   * @return                  A data Object sent
   */
  perform(message) {
    let _message = Object.assign({}, message);
    _message.id = uuidv1();
    _message.sentAt = new Date();
    let _action = Action.createWithMessage(_message).execute();
    return _message;
  }

  /**
   * Close service
   */
  close() {
    this._server.close();
  }
}

module.exports = Broker;
