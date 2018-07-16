/**
 * Module dependencies
 */
const { fromEvent } = require('rxjs');
const { skip, take, merge } = require('rxjs/operators');
const debug = require('debug')('eueuq:core');

/**
 * Builds a stream for shutdown
 *
 * @return {EventEmitter} A broadcaster for shutdown event request
 */
function SignalInterupt() {
  const _sigint$ = fromEvent(process, 'SIGINT');
  const _unexpected$ = fromEvent(process, 'uncaughtException');
  const _forcedShutdown$ = _unexpected$.pipe(merge(
    _sigint$.pipe(skip(1))
  ));

  // Attempted shutdown
  _sigint$.subscribe(() => {
    debug('Attempting shutdown');
  });

  // Forced shutdown
  _forcedShutdown$.subscribe(() => {
    debug('Shutdown forced');
    process.exit(1);
  });

  // Attempt graceful shutdown after uncaught errors
  _unexpected$.subscribe((err) => {
    debug('Uncaught exception', err);
  });

  return _forcedShutdown$.pipe(take(1));
}

module.exports = SignalInterupt();
