'use strict';

/**
 * Module dependencies
 */
const ActionError = require('../errors/action-error');

class Action {
  execute() {
    throw new ActionError('Action#execute method is not implemented');
  }
}

module.exports = Action;
