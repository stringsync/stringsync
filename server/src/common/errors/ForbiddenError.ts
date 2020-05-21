import { HttpStatusError } from './HttpStatusError';
import { HTTP_STATUSES } from './constants';

export class ForbiddenError extends HttpStatusError {
  constructor(message: string) {
    super(HTTP_STATUSES.FORBIDDEN, { detail: message });
  }
}
