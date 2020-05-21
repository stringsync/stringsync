import { HttpStatus } from './types';
import { HTTP_STATUSES } from './constants';

export class HttpStatusError extends Error {
  public readonly status: HttpStatus;

  constructor(message: string, status: HttpStatus) {
    super(message);
    this.status = status;
  }
}

export class BadRequestError extends HttpStatusError {
  constructor(message: string) {
    super(message, HTTP_STATUSES.BAD_REQUEST);
  }
}

export class ForbiddenError extends HttpStatusError {
  constructor(message: string) {
    super(message, HTTP_STATUSES.FORBIDDEN);
  }
}

export class NotFoundError extends HttpStatusError {
  constructor(message: string) {
    super(message, HTTP_STATUSES.NOT_FOUND);
  }
}
