'use strict';

/**
 * Module dependencies
 */
const { URL } = require('url');
const uuidv1 = require('uuid/v1');
const net = require('net');
const debug = require('debug')('eueuq:broker');
const EventEmitter = require('events');

const Action = require('eueuq-core').Action;
const ServiceChannel = require('eueuq-core').ServiceChannel;
const shutdownManager = require('eueuq-core').shutdownManager;

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
    this._server = null;
    this._producers = new Set();
    this._consumers = new Set();
    this._channels = new Set();
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
   * Start service
   */
  listen() {
    debug(`Listening on port ${this._getPort()}`);
    if(!this._server) {
      this._server = net.createServer((socket) => {
        let _channel = new ServiceChannel();
        let _registerMethod = _channel._createRegisterMethod();
        let _unregisterMethod = () => {
          debug(`Removing channel[${_channel.id}]`);
          this._channels.delete(_channel);
        };
        this._channels.add(_channel);
        socket.once('end', _unregisterMethod);
        socket.once('error', _unregisterMethod);
        debug(`Adding channel[${_channel.id}]`);
        _registerMethod(socket);
      });
      this._server.listen(this._getPort());
      shutdownManager.on('attempted', () => { this.close(); });

    } else {
      debug(`Existing service listening on port ${this._getPort()}`);
    }
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
   * Close connection
   */
  close() {
    if(this._serviceChannel) {
      debug('Disconnecting');
      this._serviceChannel.close();
      this._serviceChannel = null;
    } else {
      debug('Unable able to close; not listening');
    }
  }
}

module.exports = Broker;
