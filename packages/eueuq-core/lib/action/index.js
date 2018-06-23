/**
 * Module dependencies
 */
const ActionError = require('../errors/action-error');

class Action {
  execute() {
    throw new ActionError('Action#execute method is not implemented');
  }
}

/**
 * Factory method to create action
 *
 * @return {Action} An action
 */
Action.createWithMessage = function() {

};

module.exports = Action;
