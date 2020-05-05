import { successResponse, httpCode } from '@utils';

export const getAll = async (_, res) =>
  successResponse(res, httpCode.ACCEPTED, { name: 'Faizan', age: 24 });

export default {
  getAll,
};
