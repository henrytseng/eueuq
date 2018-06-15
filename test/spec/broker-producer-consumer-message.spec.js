'use strict';

/**
 * Module dependencies
 */
const Broker = require('../../packages/eueuq-broker');
const Producer = require('../../packages/eueuq-producer');
const Consumer = require('../../packages/eueuq-consumer');
const _getUri = require('../helpers/get-uri.helper');

test('instantiates a broker', () => {
  let broker = new Broker();

  expect(broker).toBeTruthy();
});

test('instantiates a producer', () => {
  let producer = new Producer('eueuq://localhost:5031', { cipherKey: 'JKfoh2ihdjsdiwn' });

  expect(producer).toBeTruthy();
});

test('instantiates a consumer', () => {
  let consumer = new Consumer('eueuq://localhost:5031', { cipherKey: 'HJfhi29dhjvcnmd' });

  expect(consumer).toBeTruthy();
});

test('connects a consumer to a broker broker', () => {
  let uri = _getUri();
  let broker = new Broker(uri);
  let config = { cipherKey: broker._getCipherKey() };
  let producer = new Producer(uri, config);
  let consumer = new Consumer(uri, config);

  process.nextTick(() => broker.listen());
  process.nextTick(() => producer.connect());


  expect(broker).toBeTruthy();
});
