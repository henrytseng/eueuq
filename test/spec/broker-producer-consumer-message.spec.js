/**
 * Module dependencies
 */
const Broker = require('../../packages/eueuq-broker');
const Producer = require('../../packages/eueuq-producer');
const Consumer = require('../../packages/eueuq-consumer');
const _getUri = require('../helpers/get-uri.helper');

test('instantiates a broker', () => {
  const broker = new Broker();

  expect(broker).toBeTruthy();
});

test('instantiates a producer', () => {
  const producer = new Producer('eueuq://localhost:5031', { cipherKey: 'JKfoh2ihdjsdiwn' });

  expect(producer).toBeTruthy();
});

test('instantiates a consumer', () => {
  const consumer = new Consumer('eueuq://localhost:5031', { cipherKey: 'HJfhi29dhjvcnmd' });

  expect(consumer).toBeTruthy();
});

test('connects a consumer to a broker broker', (done) => {
  const uri = _getUri();
  const broker = Broker(uri);
  const config = { cipherKey: broker.getCipherKey() };

  // const producer = Producer(uri, config);
  // const consumer = Consumer(uri, config);

  let messageStream = broker.messages();


  expect(broker).toBeTruthy();
  done();
});
