import { HttpStatusError } from './HttpStatusError';
import { HTTP_STATUSES } from './constants';

export class BadRequestError extends HttpStatusError {
  constructor(message: string) {
    super(HTTP_STATUSES.BAD_REQUEST, { detail: message });
  }
}
