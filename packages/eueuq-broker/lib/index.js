/**
 * Module dependencies
 */
const debug = require('debug')('eueuq:broker');

const { Subject } = require('rxjs');
const Config = require('eueuq-core').Config;
const Action = require('eueuq-core').Action;
const Channel = require('eueuq-core').Channel;

/**
 * A factory method to produce message brokers
 *
 * @param {Object} [config] A configuration Object
 */
module.exports = function Broker(config) {
  const _config = Config(config, process.env);
  const _uri = _config.connectionUri;
  const _channel = Channel(_uri.port, _uri.hostname, config);
  const _broadcast$ = new Subject();

  const _connectionSubscription = _channel.connection$().subscribe((connection) => {
    // Send broadcasted messages
    _broadcast$.subscribe(connection.outgoing$);


  });

  // Instance
  return {

    id: _channel.id,

    /**
     * Get encyption cipher
     *
     * @return {Strign} A cipher
     */
    getCipherKey: () => {
      return _config.cipherKey;
    },

    /**
     * Starts brokering on channel
     */
    listen: () => {
      _channel.listen();

    },

    /**
     * Send a message to all nodes
     */
    broadcast: (message) => {
      _broadcast$.next(message);
    },

    /**
     * Stops brokering on channel
     */
    close: () => {
      _channel.close();
      _connectionSubscription.unsubscribe();
    }


  };
};
