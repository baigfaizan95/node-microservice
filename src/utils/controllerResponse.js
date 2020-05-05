import { httpMessage } from '@utils/httpConstant';
import logger from '@/logger';

export const errorResponse = (
  req,
  res,
  code,
  error,
  userMessage,
  extraInfo
) => {
  let msg = '';
  let errRes = {};
  if (error) {
    msg = userMessage || error.message || httpMessage[code];
    errRes = {
      message: msg,
      stack: error.stack ? error.stack : error.error ? error.error.stack : null,
      internalCode: error.code || error.errno,
      errorName: error.name || error.type,
      internalMessage: error.message,
      errorObject: error || error.errors,
    };
  } else {
    msg = userMessage || httpMessage[code];
    errRes = {
      message: msg,
    };
  }
  const requestData = {
    requestID: req.headers.requestid,
    requestQuery: req.query,
    requestParam: req.param,
    requestBody: req.body || req.data,
    requestIp: req.ips || req.ip,
    requestHeaders: req.headers,
  };
  logger.error(msg, {
    httpCode: code,
    error: errRes,
    extraInfo,
    requestData,
    action: 'errorResponse',
  });
  if (process.env.NODE_ENV === 'production') {
    delete errRes.stack;
    delete errRes.errorObject;
  }
  return res.status(code).json({
    code,
    error: errRes,
    requestID: req.headers.requestid,
  });
};

export const successResponse = (res, code, result) => {
  if (result == null) {
    return res.sendStatus(code);
  }
  if (result.result) {
    return res.status(code).json({
      code,
      ...result,
    });
  }
  return res.status(code).json({
    code,
    result,
  });
};

export const paginatedResponse = (
  res,
  code,
  result,
  next,
  prev,
  offset,
  count,
  totalCount
) =>
  res.status(code).json({
    code,
    next,
    prev,
    offset,
    count,
    totalCount,
    result,
  });
