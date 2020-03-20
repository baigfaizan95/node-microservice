const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const logger = require('../logger');

const { ALLOWED_HOSTS, NODE_ENV } = process.env;

const initializeApp = (options = {}) => {
  const serverPort = options.PORT || 8000;
  const enableCORS = options.enableCORS || false;
  const serviceName = options.serviceName || 'microservice';

  const app = express();
  if (enableCORS) {
    app.use(corsHandler());
  }
  app.disable('x-powered-by');
  app.use(helmet());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.listen(serverPort, function() {
    logger.info(
      `${NODE_ENV} server started on port ${serverPort} for ${serviceName}`
    );
  });
};

const corsHandler = () => {
  const allowedOrigins = (ALLOWED_HOSTS || '').split('||');
  if (allowedOrigins.length < 1) {
    throw new Error('Please set allowed Origins before running service');
  }
  const corsOptions = {
    origin: function(origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  };
  return cors(corsOptions);
};

module.exports = initializeApp;
