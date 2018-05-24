'use strict'

/**
 * Module dependencies
 */
const { URL } = require('url')
const uuidv1 = require('uuid/v1')
const net = require('net')
const debug = require('debug')('eueuq:broker')

const Action = require('eueuq-core').Action
const Channel = require('eueuq-core').Channel
const shutdownManager = require('eueuq-core').shutdownManager

/**
 * Message broker
 */
class Broker {

  /**
   * Constructor
   *
   * @param {String} connectionUri A connection URI value
   */
  constructor(connectionUri, config) {
    this._config = config || {}
    this._uri = connectionUri
    this._server = null
  }

  /**
   * Internal method to get port
   *
   * @return {String} A port number
   */
  _getPort() {
    return this._port = this._port || (new URL(this._uri).port)
  }

  /**
   * Start service
   */
  listen() {
    debug(`Listening on port ${this._getPort()}`)
    if(!this._server) {
      this._server = net.createServer(Channel.createIncoming()).listen(this._getPort())
      shutdownManager.on('attempted', () => { this.close() })
    }
  }

  /**
   * Perform an action
   *
   * @param  {Object} message A data Object payload describing an action
   * @return                  A data Object sent
   */
  perform(message) {
    let _message = Object.assign({}, message)
    _message._id = uuidv1()
    _message._sentAt = new Date()
    let _action = Action.createWithMessage(_message).execute()
    return _message
  }

  /**
   * Close connection
   */
  close() {
    if(this._server) {
      debug('Disconnecting')
      this._server.close()
      this._server = null
    } else {
      debug('Unable able to close; not listening')
    }
  }
}

module.exports = Broker
