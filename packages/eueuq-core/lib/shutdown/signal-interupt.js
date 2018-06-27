/**
 * Module dependencies
 */
const { fromEvent } = require('rxjs');
const { skip, take } = require('rxjs/operators');
const debug = require('debug')('eueuq:core');

/**
 * Builds a stream for shutdown
 *
 * @return {EventEmitter} A broadcaster for shutdown event request
 */
function SignalInterupt() {
  const _sigint$ = fromEvent(process, 'SIGINT');
  const _forcedShutdown$ = _sigint$.pipe(skip(1));

  // Attempted shutdown
  _sigint$.subscribe(() => {
    debug('Attempting shutdown');
  });

  // Forced shutdown
  _forcedShutdown$.subscribe(() => {
    debug('Shutdown forced');
    process.exit(1);
  });

  return _sigint$.pipe(take(1));
}

module.exports = SignalInterupt();
