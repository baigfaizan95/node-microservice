'use strict';

const { httpMessage } = require('./httpConstant');

let errorResponse = function(req, res, code, error, userMessage, extraInfo) {
  let msg = '';
  let errRes = {};
  if (error) {
    (msg = userMessage || error.message || httpMessage[code]),
      (errRes = {
        message: msg,
        stack: error.stack
          ? error.stack
          : error.error
          ? error.error.stack
          : null,
        internalCode: error.code || error.errno,
        errorName: error.name || error.type,
        internalMessage: error.message,
        errorObject: error || error.errors
      });
  } else {
    msg = userMessage || httpMessage[code];
    errRes = {
      message: msg
    };
  }
  let requestData = {
    requestID: req.headers['requestid'],
    requestQuery: req.query,
    requestParam: req.param,
    requestBody: req.body || req.data,
    requestIp: req.ips || req.ip,
    requestHeaders: req.headers
  };
  logger('error', msg, {
    httpCode: code,
    error: errRes,
    extraInfo: extraInfo,
    requestData: requestData,
    action: 'errorResponse'
  });
  if (process.env.NODE_ENV === 'production') {
    delete errRes.stack;
    delete errRes.errorObject;
  }
  return res.status(code).json({
    code,
    error: errRes,
    requestID: req.headers['requestid']
  });
};

let successResponse = function(res, code, result) {
  if (result == null) {
    return res.sendStatus(code);
  } else {
    if (result.result) {
      return res.status(code).json({
        code,
        ...result
      });
    }
    return res.status(code).json({
      code,
      result
    });
  }
};

let paginatedResponse = function(
  res,
  code,
  result,
  next,
  prev,
  offset,
  count,
  totalCount
) {
  return res.status(code).json({
    code,
    next,
    prev,
    offset,
    count,
    totalCount,
    result
  });
};

module.exports = {
  errorResponse,
  successResponse,
  paginatedResponse
};
