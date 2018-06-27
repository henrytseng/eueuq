/**
 * Module dependencies
 */
const debug = require('debug')('eueuq:core:channel:messages');
const uuidv4 = require('uuid/v4');
const { Subject, fromEvent } = require('rxjs');

module.exports = function MessageStream(socket) {
  const _socketId = uuidv4();
  const _dataStream = new fromEvent(socket, 'data');
  const _messageStream = new Subject();

  /**
   * Internal debug method
   *
   * @param  {String} message A message payload
   */
  function _debug(message) {
    return debug(`[${_socketId}] ${message}`);
  }

  _dataStream.subscribe((buffer) => {

  });



  _messageStream.subscribe(() => {

  });

  //
  //
  //   let _bufferList = [];
  //
  //   socket.on('data', (buffer) => {
  //     _debug(`Received data ${buffer.length}`);
  //     let i;
  //     let k;
  //     let lastBuf;
  //     let nextBuf = buffer;
  //     let completedList;
  //
  //     // Limit looping for debugging
  //     for(k=0; (i=nextBuf.indexOf(EOL, 'utf8')) !== -1; k++) {
  //       lastBuf = nextBuf.slice(0, i);
  //       nextBuf = nextBuf.slice(i + EOL.length);
  //
  //       // Finish last
  //       _debug(`Message collected`);
  //       completedList = _bufferList;
  //       completedList.push(lastBuf);
  //
  //       _channel.onMessage(Buffer.concat(completedList));
  //
  //       _bufferList = [];
  //     }
  //
  //     _bufferList.push(nextBuf);
  //   });
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
  return _messageStream;
};
