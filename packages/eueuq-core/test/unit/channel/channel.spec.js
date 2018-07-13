const Channel = require('../../../lib/channel');
const _getUri = require('../../helpers/get-uri.helper');
const net = require('net');

describe('Channel', () => {
  test('connect server and disconnect client', (done) => {
    const port = _getUri.getPort();
    const channel = Channel(port);

    let client = net.createConnection({ port });

    channel.listen();
    channel.connection$().subscribe((observer) => {
      expect(observer).toBeTruthy();
      client.end();
      channel.close();
    });

    client.on('end', done);
  });
});
