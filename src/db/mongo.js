import logger from '@/logger';
import mongoose from 'mongoose';

export default function () {
  // mongoose.Promise = require('bluebird');
  mongoose.Promise = global.Promise;

  const dbOptions = {
    dbName: process.env.MONGO_DATABASE_NAME,
    useNewUrlParser: true,
    useCreateIndex: true,
    poolSize: 10,
    autoIndex: true,
  };

  mongoose.set('debug', process.env.MONGOOSE_DEBUG === 'true');
  mongoose.set('useUnifiedTopology', true);

  mongoose.connect(process.env.MONGO_URI, dbOptions);
  // Create connection object.
  const db = mongoose.connection;

  db.on('connected', () => {
    logger.info(
      `Mongo connection established on port ${process.env.MONGO_URI}`
    );
  });

  db.on('error', (error) => {
    if (error) {
      logger.error(
        `connection error on: ${process.env.MONGO_URI} error is: ${error.message}`
      );
    }
  });

  // When the connection is disconnected
  db.on('disconnected', () => {
    logger.info('database connection disconnected');
  });

  db.on('reconnectFailed', (error) => {
    db.close(() => {
      logger.error(
        `Reconnection failed on: ${process.env.MONGO_URI} error is: ${error.message}`
      );
      process.exit(0);
    });
  });

  // If the Node process ends, close the Mongoose connection
  process.on('SIGINT', () => {
    db.close(() => {
      logger.info(
        'Mongoose default connection disconnected through app termination'
      );
      process.exit(0);
    });
  });
}
