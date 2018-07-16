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
  const _dataData$ = new fromEvent(socket, 'data');
  const _dataSubscription = _dataData$.subscribe({
    next: (data) => {
      _debug(`Received data length:${data.length}`);

      let nextBuf = data;
      let i;
      while((i = nextBuf.indexOf(EOL, 'utf8')) != -1) {
        let prevBuf = nextBuf.slice(0, i);
        nextBuf = nextBuf.slice(i + EOL.length);
        _message$.next(prevBuf);
        _completion$.next(i);
      }
      _message$.next(nextBuf);
    },
    error: (err) => {
      _message$.error(err);
    },
    complete: () => {
      _debug.log('complete');
    }
  });

  // Error
  socket.on('error', (err) => {
    _debug(`Socket connection error ocurred ${err}`);
    _message$.error(err);
  });

  // end
  socket.on('end', () => {
    _debug(`Disconnected`);
    _message$.complete();
    _completion$.complete();
    _dataSubscription.unsubscribe();
  });

  return _message$;
};
