const { fromEvent } = require('rxjs');
const { skip } = require('rxjs/operators');
const debug = require('debug')('eueuq:core');

/**
 * Builds a stream for shutdown
 *
 * @return {EventEmitter} A broadcaster for shutdown event request
 */
function SignalInterupt() {
  const _sigintStream = fromEvent(process, 'SIGINT');
  const _forcedShutStream = _sigintStream.pipe(skip(1));

  // Attempted shutdown
  _sigintStream.subscribe(() => {
    debug('Attempting shutdown');
  });

  // Forced shutdown
  _forcedShutStream.subscribe(() => {
    debug('Shutdown forced');
    process.exit(1);
  });

  return _sigintStream;
}

module.exports = SignalInterupt();
