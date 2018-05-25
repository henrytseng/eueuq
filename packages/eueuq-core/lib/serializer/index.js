'use strict';

const crypto = require('crypto');
const debug = require('debug')('eueuq:core');

/**
 * Serializer
 */
class Serializer {
  constructor() {
    this.algorithm = 'aes-256-ecb';
  }

  _getCipherKey() {
    if(this.cipherKey) {
      return this.cipherKey;
    } else {
      const buf = crypto.randomBytes(256);
      this.cipherKey = buf.toString();
      debug('Warning choosing a random cipher key');
      return this.cipherKey;
    }
  }

  /**
   * Encodes data to encrypted serialized payload
   *
   * @param  {Object} decrypted A decrypted object
   * @return {String}           A serialized encrypted String
   */
  encode(decrypted) {
    let payload = JSON.stringify(decrypted);
    let cipher = crypto.createCipher(this.algorithm, this._getCipherKey());
    let encrypted = cipher.update(payload, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  /**
   * Decodes serialized payload to original data
   *
   * @param  {String} encrypted A serialized encrypted String
   * @return {Object}           A decrypted object
   */
  decode(encrypted) {
    let decipher = crypto.createDecipher(this.algorithm, this._getCipherKey());
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    let payload = JSON.parse(decrypted);
    return payload;
  }
}

module.exports = Serializer;
