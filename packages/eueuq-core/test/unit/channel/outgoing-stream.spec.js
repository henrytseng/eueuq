const OutgoingStream = require('../../../lib/channel/outgoing-stream');
const sinon = require('sinon');

describe('OutgoingStream', () => {
  test('dispatched message stream is written to socket', (done) => {
    const socket = {
      write: sinon.spy()
    };
    const message$ = OutgoingStream(socket);
    const _data = {
      ipsum: 'lorem'
    };

    message$.next(_data);

    expect(socket.write.calledWith(_data)).toBe(true);

    done();
  });
});
