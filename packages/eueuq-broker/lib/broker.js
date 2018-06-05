'use strict';

/**
 * Module dependencies
 */
const { URL } = require('url');
const uuidv1 = require('uuid/v1');
const debug = require('debug')('eueuq:broker');
const EventEmitter = require('events');

const Action = require('eueuq-core').Action;
const ServiceChannel = require('eueuq-core').ServiceChannel;

let EUEUQ_CIPHER_KEY = process.env.EUEUQ_CIPHER_KEY;
let EUEUQ_BROKER_URI = process.env.EUEUQ_BROKER_URI;

/**
 * Message broker
 */
class Broker extends EventEmitter {

  /**
   * Constructor
   *
   * @param {String} connectionUri A connection URI value
   * @param {Object} [config]      A optional configuration Object
   */
  constructor(connectionUri, config) {
    super();
    this._config = config || {};
    this._config = Object.assign({
      cipherKey: EUEUQ_CIPHER_KEY
    }, this._config);
    this._uri = connectionUri || EUEUQ_BROKER_URI || 'eueuq://localhost:5031';
    this._producers = new Set();
    this._consumers = new Set();
    this._channel = new ServiceChannel();
  }

  /**
   * Internal method to get port
   *
   * @return {String} A port number
   */
  _getPort() {
    return this._port = this._port || (new URL(this._uri).port);
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
    this._channel.listen(this._getPort());
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
    this._channel.close();
  }
}

module.exports = Broker;
