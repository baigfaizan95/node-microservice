const mongoose = require('mongoose');
const logger = require('../logger');
function connect() {
  const { MONGO_URI, MONGO_DATABASE_NAME } = process.env;
  if (!MONGO_URI) {
    return logger.info('No mongodb URI');
  }
  if (!MONGO_DATABASE_NAME) {
    return logger.info('No mongodb database name');
  }
  const dbOptions = {
    dbName: MONGO_DATABASE_NAME,
    useNewUrlParser: true,
    useCreateIndex: true,
    poolSize: 10,
    autoReconnect: true,
    reconnectInterval: 1000,
    reconnectTries: 10,
    autoIndex: true
  };

  mongoose.connect(MONGO_URI, dbOptions);

  mongoose.connection.on('connected', () => {
    logger.info('Mongoose default connection is open to ', connection_string);
  });

  mongoose.connection.on('error', err => {
    logger.warn('Mongoose default connection has occured ' + err + ' error');
  });

  mongoose.connection.on('disconnected', () => {
    logger.error('Mongoose default connection is disconnected');
  });

  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      logger.error(
        'Mongoose default connection is disconnected due to application termination'
      );
      process.exit(0);
    });
  });
}

module.exports = connect;
