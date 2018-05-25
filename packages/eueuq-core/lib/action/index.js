'use strict';

/**
 * Module dependencies
 */
const ActionError = require('../errors/action-error');

function Action() {
  return {
    execute: () => {
      throw new ActionError('Action#execute is not implemented');
    }
  };
}

module.exports = Action;
