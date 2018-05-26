'use strict';

/**
 * Module dependencies
 */
const ServiceChannel = require('./service-channel');
const ClientChannel = require('./client-channel');

// constants
const CHANNEL_MAP = {
  service: ServiceChannel,
  client: ClientChannel
};

/**
 * A static channel factory
 *
 * @type {Object}
 */
module.exports = {

  /**
   * A builder for factory methods
   *
   * @param  {Broker}   service A broker service
   * @param  {String}   type    An identifier for type of channel
   * @return {Function}         A creator method
   */
  buildCreateMethod: function(service, type) {
    // Whitelist types
    let _ref = CHANNEL_MAP[type];
    if(!_ref) {
      throw new Error(`Unsupported channel type (${type})`);
    }

    /**
    * Factory method
    *
    * @param  {net.Socket} socket  A socket connection
    * @return {Channel}            A channel
    */
    return (socket) => {
      let channel = new _ref(service, type);
      return channel._registerSocket(socket);
    };
  }

};
