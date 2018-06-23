'use strict';

const crypto = require('crypto');
const debug = require('debug')('eueuq:core');

/**
 * Serializer
 */
module.exports = function Serializer(config) {
  const _config = config || {};
  const _algorithm = _config.algorithm || 'aes-256-ecb';
  const _cipherKey = _config.cipherKey;

  /**
   * Build random key
   *
   * @param  {Number} [num] An optional length, defaults to 256
   * @return {String}       A random cipher key
   */
  function _generateKey(num) {
    const buf = crypto.randomBytes(num || 256);
    return buf.toString();
  }

  /**
   * Internal method to ensure that a cipher key was set
   *
   * @return {String} A cipher key for encryption
   */
  function _getCipherKey() {
    if(!_cipherKey) {
      debug('Warning choosing a random cipher key');
      return _generateKey();
    }

    return _cipherKey;
  }

  // Static
  return {

    generateKey: _generateKey,

    /**
     * Encodes data to encrypted serialized payload
     *
     * @param  {Object} decrypted A decrypted object
     * @return {String}           A serialized encrypted String
     */
    encode: (decrypted) => {
      const payload = JSON.stringify(decrypted);
      const cipher = crypto.createCipher(_algorithm, _getCipherKey());
      let encrypted = cipher.update(payload, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      return encrypted;
    },

    /**
     * Decodes serialized payload to original data
     *
     * @param  {String} encrypted A serialized encrypted String
     * @return {Object}           A decrypted object
     */
    decode: (encrypted) => {
      const decipher = crypto.createDecipher(_algorithm, _getCipherKey());
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      const payload = JSON.parse(decrypted);
      return payload;
    }

  };

};
