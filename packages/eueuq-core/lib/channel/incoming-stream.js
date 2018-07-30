/**
 * Module dependencies
 */
const debug = require('debug')('eueuq:core:channel:incoming');
const uuidv4 = require('uuid/v4');
const { Subject, fromEvent } = require('rxjs');
const { buffer, map } = require('rxjs/operators');
const Config = require('../config');
const Message = require('./message');

/**
 * An incoming-outgoing message stream
 *
 * @param  {net.Socket}         socket    A socket connection
 * @param  {String}             channelId A channel id
 * @param  {Config}             [config]  A configuration object
 * @return {Observable<Buffer>}           A message stream
 */
module.exports = function IncomingMessageStream(socket, channelId, config) {
  const _channelId = channelId || uuidv4();
  const _config = Config(config, process.env);
  const _bufferedCompletion$ = new Subject();

  // Build message stream from stream of Array<Buffer>
  const _message$ = new Subject().pipe(
    buffer(_bufferedCompletion$),
    map((i) => Array.isArray(i) ? Buffer.concat(i) : i)
  );

  /**
   * Internal debug method
   *
   * @param  {String} message A message payload
   */
  function _debug(message) {
    return debug(`[${_channelId}] ${message}`);
  }

  // Send completed chunks
  const _data$ = new fromEvent(socket, 'data');
  const _dataSubscription = _data$.subscribe({
    next: (data) => {
      _debug(`Received data length:${data.length}`);

      let nextBuf = data;
      let i;
      while((i = nextBuf.indexOf(Message.EOL, 'utf8')) != -1) {
        let prevBuf = nextBuf.slice(0, i);
        nextBuf = nextBuf.slice(i + Message.EOL.length);
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
