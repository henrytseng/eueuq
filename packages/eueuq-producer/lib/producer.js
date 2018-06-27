/**
 * Module dependencies
 */
const debug = require('debug')('eueuq:producer');

const Config = require('eueuq-core').Config;

/**
 * Message producer
 */
module.exports = function Producer(config) {
  const _config = Config(config, process.env);
  const _uri = _config.connectionUri;

  return {};
};
