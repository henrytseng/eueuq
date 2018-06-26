const ConnectionStream = require('../../../lib/channel/connection-stream');
const _getUri = require('../../helpers/get-uri.helper');
const net = require('net');

describe('ConnectionStream', () => {
  test('connect server and disconnect client', (done) => {
    const port = _getUri.getPort();
    const connectionStream = ConnectionStream(port);

    let client = net.createConnection({ port });

    connectionStream.subscribe((observer) => {
      expect(observer).toBeTruthy();
      done();
    });
  });
});
