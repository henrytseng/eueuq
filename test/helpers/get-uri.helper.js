/**
 * Get a random port
 *
 * @return      {Number} A random port value
 */
function _getPort() {
  return Math.floor(Math.random() * 500) + 5000;
}

/**
 * Generates URI with a random port
 *
 * @return {String} A URI
 */
module.exports = function() {
  let port = _getPort();
  let uri = `eueq://localhost:${port}`;
  return uri;
};

module.exports.getPort = _getPort;
