'use strict';

const sinon = require('sinon');
const Channel = require('../../../lib/channel');

test('registers a socket connection', () => {
  let channel = new Channel();
  let socket = {
    on: sinon.spy()
  };

  channel._open()(socket);
  expect(socket.on.callCount).toBe(3);
});
