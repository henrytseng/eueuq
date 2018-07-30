const IncomingStream = require('../../../lib/channel/incoming-stream');
const Message = require('../../../lib/channel/message');
const EventEmitter = require('events').EventEmitter;
const crypto = require('crypto');
const {crc32} = require('crc');

describe('IncomingStream', () => {
  test('message stream data dispatched', (done) => {
    const socket = new EventEmitter();
    const message$ = IncomingStream(socket);

    // Recombined
    let recombined = [];
    message$.subscribe({
      next: (data) => {
        recombined.push(data);
      },
      complete: () => {
        done();
      },
      error: (err) => {
        expect(err).toBeUndefined();
      }
    });

    // Build payload
    let payload = [`dolor sed`, `lorem${Message.EOL}ipsum `, `sed ut`, `${Message.EOL}`];
    payload.map((data) => {
      socket.emit('data', Buffer.from(data));
    });

    // Check reformed messages
    expect(recombined[0].toString()).toEqual("dolor sedlorem");
    expect(recombined[1].toString()).toEqual("ipsum sed ut");

    socket.emit('end');
  });

  test('reasonable response rate for large messages', (done) => {
    const socket = new EventEmitter();
    const message$ = IncomingStream(socket);

    // Recombined
    let recombined = [];
    message$.subscribe({
      next: (data) => {
        recombined.push(data);
      },
      complete: () => {
        done();
      },
      error: (err) => {
        expect(err).toBeUndefined();
      }
    });

    // Build large payload
    let payload = [];
    for(let i=0; i<5; i++) {
      let gram = crypto.randomBytes(1024 * 1024).toString('base64');
      payload.push(gram);
    }
    payload.push(Message.EOL);
    payload.forEach((data) => socket.emit('data', Buffer.from(data)));

    // Check sent is received
    expect(payload.length).toEqual(6);
    expect(recombined.length).toEqual(1);
    let sent = Buffer.from(payload.slice(0, 5).join(''));
    let received = recombined[0];
    expect(received.length).toEqual(sent.length);
    expect(crc32(received).toString(16)).toEqual(crc32(sent).toString(16));

    socket.emit('end');
  });

  test('handle subscription errors', (done) => {
    const socket = new EventEmitter();
    const message$ = IncomingStream(socket);

    // End only on error
    message$.subscribe({
      next: (data) => {
        expect('Should not occur').toBeFalsy();
      },
      complete: () => {
        expect('Should not occur').toBeFalsy();
      },
      error: (err) => {
        expect(err).toBeTruthy();
        done();
      }
    });

    // Build payload
    socket.emit('error', new Error('Generic error'));

    // Does not send data
    socket.emit('data', 'Lorem ipsum');

    // Does not complete
    socket.emit('end');
  });
});
