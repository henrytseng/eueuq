/**
 * Generates URI with a random port
 *
 * @return {String} A URI
 */
module.exports = function() {
  let port = Math.floor(Math.random() * 500) + 5000;
  let uri = `eueq://localhost:${port}`;
  return uri;
};
