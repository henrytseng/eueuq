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
    cipherKey: _env.EUEUQ_CIPHER_KEY,
    connectionUri: new URL(_env.EUEUQ_BROKER_URI || 'eueuq://localhost:5031')
  }, config || {});

  // Configuration
  return _config;
};
