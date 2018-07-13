/**
 * Module dependencies
 */
const debug = require('debug')('eueuq:core:channel:messages');
const uuidv4 = require('uuid/v4');
const { Subject, fromEvent } = require('rxjs');
const { buffer, map } = require('rxjs/operators');

const EOL = "\n";

module.exports = function MessageStream(socket) {
  const _socketId = uuidv4();
  const _completion$ = new Subject();
  const _message$ = new Subject().pipe(buffer(_completion$), map((i) => i.join('')));

  /**
   * Internal debug method
   *
   * @param  {String} message A message payload
   */
  function _debug(message) {
    return debug(`[${_socketId}] ${message}`);
  }

  // Send completed chunks
  const _socketData$ = new fromEvent(socket, 'data');
  _socketData$.subscribe((data) => {
    _debug(`Received data ${data.length}`);

    let nextBuf = data;
    let i;
    while((i = nextBuf.indexOf(EOL, 'utf8')) != -1) {
      let prevBuf = nextBuf.slice(0, i);
      nextBuf = nextBuf.slice(i + EOL.length);
      _message$.next(prevBuf);
      _completion$.next(i);
    }
    _message$.next(nextBuf);
  });


  //   socket.on('error', (err) => {
  //     _debug(`Encountered error: ${err.message}`);
  //     _bufferList = [];
  //     _channel.onError(err);
  //   });
  //   socket.on('end', () => {
  //     _debug(`Disconnected`);
  //     _bufferList = [];
  //     _channel.onEnd();
  //   });
  // });
  //
  return _message$;
};
