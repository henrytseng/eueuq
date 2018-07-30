/**
 * Module dependencies
 */
const debug = require('debug')('eueuq:core:channel:outgoing');
const uuidv4 = require('uuid/v4');
const { Subject } = require('rxjs');
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
module.exports = function OutgoingMessageStream(socket, channelId, config) {
  const _channelId = channelId || uuidv4();
  const _config = Config(config, process.env);
  const _message$ = new Subject();

  /**
   * Internal debug method
   *
   * @param  {String} message A message payload
   */
  function _debug(message) {
    return debug(`[${_channelId}] ${message}`);
  }

  _message$.subscribe((data) => {
    const _message = data;
    _debug(`Sending ${_message.id}`);
    socket.write(_message);
  });

  return _message$;
};
