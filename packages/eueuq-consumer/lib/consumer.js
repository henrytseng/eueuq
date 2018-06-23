/**
 * Module dependencies
 */
const debug = require('debug')('eueuq:consumer');

const Config = require('eueuq-core').Config;

/**
 * Message consumer
 */
module.exports = function Consumer(config) {
  const _config = Config(config, process.env);
  const _uri = _config.connectionUri;
};
