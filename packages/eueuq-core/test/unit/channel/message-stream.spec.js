const MessageStream = require('../../../lib/channel/message-stream');
const EventEmitter = require('events').EventEmitter;

describe('MessageStream', () => {
  test('message stream data dispatched', (done) => {
    const socket = new EventEmitter();
    const message$ = MessageStream(socket);

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
    let payload = ["dolor sed", "lorem\nipsum ", "sed ut", "\n"];
    payload.map((data) => {
      socket.emit('data', new Buffer(data));
    });

    // Check reformed messages
    expect(recombined[0]).toEqual("dolor sedlorem");
    expect(recombined[1]).toEqual("ipsum sed ut");

    socket.emit('end');
  });

  test('handle subscription errors', (done) => {
    const socket = new EventEmitter();
    const message$ = MessageStream(socket);

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

    // Does not get emitted
    socket.emit('end');
  });
});
