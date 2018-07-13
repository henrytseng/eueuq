module.exports = {
  Action: require('./action'),
  Config: require('./config'),
  ConnectionStream: require('./channel/connection-stream'),
  errors: {
    ConfigurationError: require('./errors/configuration-error'),
    ConnectionError: require('./errors/connection-error')
  },
  signalInterupt: require('./shutdown/signal-interupt')
};
