/**
 * Module dependencies
 */
const { fromEvent } = require('rxjs');
const { Subject } = require('rxjs');
const { skip, take } = require('rxjs/operators');
const debug = require('debug')('eueuq:core');

/**
 * Builds a stream for shutdown requests
 *
 * @return {EventEmitter} A broadcaster for shutdown event request
 */
function SignalInterupt() {
  const _sigint$ = fromEvent(process, 'SIGINT');
  const _unexpected$ = fromEvent(process, 'uncaughtException');
  const _shutdownRequest$ = new Subject();

  // Attempted shutdown
  _sigint$.subscribe(() => {
    debug('Attempting shutdown');
  });

  // Attempt graceful shutdown after uncaught errors
  _unexpected$.subscribe((err) => {
    debug('Uncaught exception', err);
  });

  // Forced shutdown
  _sigint$.pipe(skip(1), take(1)).subscribe(_shutdownRequest$);
  _unexpected$.pipe(take(1)).subscribe(_shutdownRequest$);
  _shutdownRequest$.subscribe(() => {
    debug('Shutdown forced');
    process.nextTick(() => process.exit(1));
  });

  // Only requests before forcing shutdown honored
  return _sigint$.pipe(take(1));
}

module.exports = SignalInterupt();
