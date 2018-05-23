'use strict'

const { URL } = require('url')
const debug = require('debug')('eueuq:broker')

function Broker(url, topics) {
  let _resource = new URL(url)
  let _port = _resource.port

  return {

    /**
     * Start service
     *
     * @return {Broker} [description]
     */
    listen() {
      debug(`Listening on port ${_port}`)
    },

    /**
     * Perform an action
     *
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    perform: (data) => {

    },

    close() {
      debug('Disconnecting')
    }
  }
}

module.exports = Broker
