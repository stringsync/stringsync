import { HttpStatuses } from './types';

export const HTTP_STATUSES: Readonly<HttpStatuses> = {
  OK: 200,
  BAD_REQUEST: 400,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};
