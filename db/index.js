const mongo = require('./mongo');
const redis = require('./redis');
const sequelize = require('./sequelize');
module.exports = {
  sequelize,
  mongo,
  redis
};
