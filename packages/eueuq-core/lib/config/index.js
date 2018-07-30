/**
 * Module dependencies
 */
const { URL } = require('url');

/**
 * Configuration
 *
 * @param       {Object} config A hash Object of configuration settings
 * @param       {Object} env    A hash Object of environment variables
 * @constructor
 */
module.exports = function Config(config, env) {
  const _env = env || {};
  const _config = Object.assign({

    // Message encryption cipher key
    cipherKey: _env.EUEUQ_CIPHER_KEY,

    // Conenction URI
    connectionUri: new URL(_env.EUEUQ_BROKER_URI || 'eueuq://localhost:5031'),

    // Service open retry attempts
    maxServerRetryAttempt: 5,

    // Service re-open retry delay
    serverRetryDelay: 1000

  }, config || {});

  // Configuration
  return _config;
};
