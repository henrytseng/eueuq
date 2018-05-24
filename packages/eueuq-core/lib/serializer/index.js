'use strict'

const crypto = require('crypto')
const debug = require('debug')('eueuq:core')

class Serializer {
  constructor() {
    this.algorithm = 'aes-256-ctr'
  }

  _getCipherKey() {
    if(this.cipherKey) {
      return this.cipherKey
    } else {
      const buf = crypto.randomBytes(256)
      this.cipherKey = buf.toString()
      debug('Warning choosing a random cipher key')
      return this.cipherKey
    }
  }

  encode(decrypted) {
    let payload = JSON.stringify(decrypted)
    let cipher = crypto.createCipher(this.algorithm, this._getCipherKey())
    let encrypted = cipher.update(payload, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    return encrypted
  }

  decode(encrypted) {
    let decipher = crypto.createDecipher(this.algorithm, this._getCipherKey())
    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    let payload = JSON.parse(decrypted)
    return payload
  }
}

module.exports = Serializer
