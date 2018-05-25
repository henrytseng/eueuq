'use strict';

const EventEmitter = require('events');
const debug = require('debug')('eueuq:core');

/**
 * Builds an instance of shutdown manager
 *
 * @return {EventEmitter} A broadcaster for shutdown event request
 */
function getInstance() {
  let _attemptedShutdown = 0;
  let _emitter = new EventEmitter();

  // Static instance
  let _instance = {

    /**
     * Request shutdown
     */
    attempt: () => {
      _attemptedShutdown++;
      if(_attemptedShutdown === 1) {
        debug('Attempting shutdown');
        _emitter.emit('attempted');
      } else {
        _instance.force();
      }
    },

    /**
     * Forces a shutdown
     */
    force: () => {
      debug('Shutdown forced');
      _emitter.emit('forced');
      process.exit(1);
    }
  };

  // Register events
  process.on('SIGINT', _instance.attempt);

  return _emitter;
}

module.exports = getInstance();
