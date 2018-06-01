'use strict';

const Broker = require('../../packages/eueuq-broker');

test('opens a broker', () => {
  let broker = new Broker();

  expect(broker).toBeTruthy();
});
