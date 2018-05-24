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
 *
 * @param       {String} uri    A service URI
 * @param       {Array}  topics A list of strings
 * @constructor
 */
class Broker {

  /**
   * Constructor
   *
   * @param {[type]} connectionUri [description]
   */
  constructor(connectionUri) {
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
   * @param  {Object} data A data Object payload describing an action
   * @return               A data Object sent
   */
  perform(data) {
    let _data = Object.assign({}, data)



    let _action = new Action(data)
    return _action
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
