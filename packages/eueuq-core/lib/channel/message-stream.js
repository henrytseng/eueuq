/**
 * Module dependencies
 */
const debug = require('debug')('eueuq:core:channel:messages');
const uuidv4 = require('uuid/v4');
const { Subject, fromEvent } = require('rxjs');
const { buffer, map } = require('rxjs/operators');

const EOL = "\n";

/**
 * A meesage stream
 *
 * @param  {net.Socket}         socket A socket connection
 * @return {Observable<Buffer>}        A message Buffer object
 */
module.exports = function MessageStream(socket) {
  const _socketId = uuidv4();
  const _bufferedCompletion$ = new Subject();
  const _message$ = new Subject().pipe(buffer(_bufferedCompletion$), map((i) => {
    return Buffer.concat(i);
  }));

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
        _bufferedCompletion$.next(i);
      }
      _message$.next(nextBuf);
    },
    error: (err) => {
      _message$.error(err);
    },
    complete: () => {
      _debug.log('Complete');
    }
  });

  // Error
  socket.on('error', (err) => {
    _debug(`Socket connection error ocurred ${err}`);
    _message$.error(err);
    _bufferedCompletion$.complete();
    _dataSubscription.unsubscribe();
  });

  // end
  socket.on('end', () => {
    _debug(`Disconnected`);
    _message$.complete();
    _bufferedCompletion$.complete();
    _dataSubscription.unsubscribe();
  });

  return _message$;
};
