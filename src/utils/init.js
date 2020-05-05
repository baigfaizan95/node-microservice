import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import logger from '@/logger';

const { ALLOWED_HOSTS } = process.env;
const { NODE_ENV } = process.env;

const corsHandler = () => {
  const allowedOrigins = (ALLOWED_HOSTS || '').split('||');
  if (allowedOrigins.length < 1) {
    throw new Error('Please set allowed Origins before running service');
  }
  const corsOptions = {
    origin: (origin, callback) => {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  };
  return cors(corsOptions);
};

const initializeApp = (options = {}) => {
  const serverPort = options.PORT || 8000;
  const serviceName = options.serviceName || 'microservice';

  const app = express();
  if (NODE_ENV !== 'production') {
    app.use(corsHandler());
  } else {
    app.use(cors());
  }
  app.disable('x-powered-by');
  app.use(helmet());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.listen(serverPort, () => {
    logger.info(
      `${NODE_ENV} server started on port ${serverPort} for ${serviceName}`
    );
  });

  return app;
};

export default initializeApp;
