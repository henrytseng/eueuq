const Action = require('../../../lib/action');

test('abstract Action cannot execute', () => {
  expect(() => {
    let a = new Action();
    a.execute();
  }).toThrowError('Action#execute method is not implemented');
});
