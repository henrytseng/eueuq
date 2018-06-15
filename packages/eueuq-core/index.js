'use strict';

module.exports = {
  Action: require('./lib/action'),
  ChannelServer: require('./lib/channel/channel-server'),
  ServiceChannel: require('./lib/channel/service-channel'),
  ClientChannel: require('./lib/channel/client-channel'),
  errors: {
    ConfigurationError: require('./lib/errors/configuration-error'),
    ConnectionError: require('./lib/errors/connection-error')
  },
  shutdownManager: require('./lib/shutdown/shutdown-manager')
};
