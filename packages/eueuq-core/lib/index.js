module.exports = {
  Action: require('./lib/action'),
  Config: require('./lib/config'),
  ConnectionStream: require('./lib/channel/connection-stream'),
  errors: {
    ConfigurationError: require('./lib/errors/configuration-error'),
    ConnectionError: require('./lib/errors/connection-error')
  },
  signalInterupt: require('./lib/shutdown/signal-interupt')
};
