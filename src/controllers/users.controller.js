import { errorResponse, successResponse, httpCode } from '@utils';

export const getAll = async (req, res) => {
  return successResponse(res, httpCode.ACCEPTED, { name: 'Faizan', age: 24 });
};
