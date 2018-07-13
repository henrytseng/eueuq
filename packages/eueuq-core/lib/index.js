module.exports = {
  Action: require('./action'),
  Config: require('./config'),
  Channel: require('./channel'),
  errors: {
    ConfigurationError: require('./errors/configuration-error'),
    ConnectionError: require('./errors/connection-error')
  },
  signalInterupt: require('./shutdown/signal-interupt')
};
