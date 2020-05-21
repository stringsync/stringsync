import { HttpStatusError } from './HttpStatusError';
import { HTTP_STATUSES } from './constants';

export class NotFoundError extends HttpStatusError {
  constructor(message: string) {
    super(HTTP_STATUSES.NOT_FOUND, { detail: message });
  }
}
