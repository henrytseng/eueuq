const Broker = require('../../lib/index');
const EventEmitter = require('events').EventEmitter;
const _getUri = require('../../../../test/helpers/get-uri.helper');

describe('Broker', () => {
  test('instantiates a broker', () => {
    const broker = Broker(_getUri());
    expect(broker).toBeTruthy();
  });

  test('client can connect', () => {

  });

  test('broadcast message to multiple clients', () => {

  });

  test('receives messages from clients', () => {

  });

  test('sends message to specific client', () => {

  });



});
