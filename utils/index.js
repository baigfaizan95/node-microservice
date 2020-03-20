const {
  errorResponse,
  successResponse,
  paginatedResponse
} = require('./controllerResponse');

const { httpCode, httpMessage } = require('./httpConstant');
const to = require('./awaitTo');

module.exports = {
  init: require('./init'),
  errorResponse,
  successResponse,
  paginatedResponse,
  httpCode,
  httpMessage,
  to
};
