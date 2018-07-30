const Channel = require('../../../lib/channel');
const _getUri = require('../../../../../test/helpers/get-uri.helper');
const net = require('net');
const sinon = require('sinon');

describe('Channel', () => {
  test('connect server and disconnect client', (done) => {
    const port = _getUri.getPort();
    const channel = Channel(port);

    const client = net.createConnection({ port });
    const onConnect = sinon.fake();
    const onError = sinon.fake();

    channel.listen();
    channel.connection$().subscribe({
      next: (connection) => {
        expect(connection).toBeTruthy();
        channel.close();
      },
      complete: () => {
        // Explicityly disconnect client for signal
        client.end();
      },
      error: (err) => {
        expect(err).toBeUndefined();
      }
    });

    client.on('connect', onConnect);
    client.on('error', onError);
    client.on('end', () => {
      expect(onConnect.calledOnce).toBe(true);
      expect(onError.calledOnce).toBe(false);
      done();
    });

  });

  test('closed channel no longer sends', (done) => {
    done();
  });

  test('closed channel no longer receives', (done) => {
    done();
  });
});
