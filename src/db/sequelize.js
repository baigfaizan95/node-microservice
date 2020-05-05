import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import configFile from '@config/sequelize';
import logger from '@/logger';

const env =
  process.env.NODE_ENV === 'production' ? 'production' : 'development';
const config = configFile[env];
const db = {};
const sequelize = new Sequelize(config);
const modelsPath = path.join(__dirname, '../models/sequelize');

const { SQL_HOST } = process.env;

fs.readdirSync(modelsPath)
  .filter((file) => file.indexOf('.') !== 0 && file.slice(-3) === '.js')
  .forEach((file) => {
    const model = sequelize.import(path.join(modelsPath, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

const checkConnection = () => {
  if (SQL_HOST) {
    sequelize
      .authenticate()
      .then(() => {
        logger.info(
          'Connection has been established successfully to sequelize'
        );
      })
      .catch((err) => {
        logger.error('Unable to connect to the database:', err);
      });
  } else {
    logger.info('No sequelize host');
  }
};

export default {
  sequelize,
  Sequelize,
  checkConnection,
};
