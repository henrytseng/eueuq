'use strict'

/**
 * Module dependencies
 */
const { URL } = require('url')
const uuidv1 = require('uuid/v1')
const net = require('net')
const debug = require('debug')('eueuq:broker')

const Action = require('./action')
const Channel = require('./channel')

/**
 * Message broker
 *
 * @param       {String} uri    A service URI
 * @param       {Array}  topics A list of strings
 * @constructor
 */
function Broker(uri, topics) {
  let _resource = new URL(uri)
  let _port = _resource.port
  let _server
  let _attemptedShutdown = 0

  // Instance
  return {

    /**
     * Start service
     *
     * @return {Broker} [description]
     */
    listen() {
      debug(`Listening on port ${_port}`)
      if(!_server) {
        _server = net.createServer(Channel.createIncoming()).listen(_port)
        _attemptedShutdown = 0
        process.on('SIGINT', () => this.close())
      }
    },

    /**
     * Perform an action
     *
     * @param  {Object} data A data Object payload describing an action
     * @return               A data Object sent
     */
    perform: (data) => {
      let _data = Object.assign({}, data)
      let _action = Action.create(data)
      return _action
    },

    /**
     * Close connection
     */
    close() {
      _attemptedShutdown++
      if(_attemptedShutdown > 1) {
        debug('Force shutdown')
        process.exit(1)
      }

      if(_server) {
        debug('Disconnecting')
        _server.close()
        _server = null
      } else {
        debug('Unable able to close; not listening')
      }
    }
  }
}

module.exports = Broker
