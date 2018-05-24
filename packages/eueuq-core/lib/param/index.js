'use strict'

/**
 * Module dependencies
 */
const R = require('ramda')

const _requireSymbol = Symbol('require')
const _permitSymbol = Symbol('permit')

/**
 *
 * @param  {[type]} data A data Object
 * @return {Object}      A parametrized data Object
 */
function params(data) {
  let _permittedList = []
  let _data = Object.assign({}, data)

  /**
   * Throws an error when required parameter is not available
   *
   * @param  {String} name A parameter name
   * @return {Object}      A parametrized data Object
   */
  Object.defineProperty(_data, 'require', {
    enumerable: false,
    value: (name) => {
      if(!data.hasOwnProperty(name)) {
        throw new Error('A required parameter is missing')
      }
      return _data
    }
  })

  /**
   * Allows a parameter
   *
   * @param  {String} name A parameter name
   * @return {Object}      A parametrized data Object
   */
  Object.defineProperty(_data, 'permit', {
    enumerable: false,
    value: (name) => {
      _permittedList.push(name)
      return R.pick(_permittedList, _data)
    }
  })

  return _data
}

module.exports = params
