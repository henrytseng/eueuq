/**
 * Module dependencies
 */
const Broker = require('../../packages/eueuq-broker');
const Producer = require('../../packages/eueuq-producer');
const Consumer = require('../../packages/eueuq-consumer');
const _getUri = require('../helpers/get-uri.helper');

test('instantiates a producer', () => {
  const producer = Producer(_getUri(), { cipherKey: 'JKfoh2ihdjsdiwn' });
  expect(producer).toBeTruthy();
});

test('instantiates a consumer', () => {
  const consumer = Consumer(_getUri(), { cipherKey: 'HJfhi29dhjvcnmd' });
  expect(consumer).toBeTruthy();
});

test('connects a consumer to a broker broker', (done) => {
  const uri = _getUri();
  const broker = Broker(uri);
  const config = { cipherKey: broker.getCipherKey() };

  const producer = Producer(uri, config);
  const consumer = Consumer(uri, config);



  expect(broker).toBeTruthy();
  expect(producer).toBeTruthy();
  expect(consumer).toBeTruthy();
  done();
});
