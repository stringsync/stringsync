import { HttpStatus, Extensions } from './types';
import { HTTP_STATUSES } from './constants';

abstract class HttpStatusError extends Error {
  static status: HttpStatus;
  extensions: Extensions;

  constructor(message: string, extensions: Extensions) {
    super(message);
    this.extensions = extensions;
    Object.setPrototypeOf(this, HttpStatusError.prototype);
  }
}

export class BadRequestError extends HttpStatusError {
  static status = HTTP_STATUSES.BAD_REQUEST;

  constructor(message: string) {
    super(message, { status: BadRequestError.status });
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}

export class ForbiddenError extends HttpStatusError {
  static status = HTTP_STATUSES.FORBIDDEN;

  constructor(message: string) {
    super(message, { status: ForbiddenError.status });
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

export class NotFoundError extends HttpStatusError {
  static status = HTTP_STATUSES.NOT_FOUND;

  constructor(message: string) {
    super(message, { status: NotFoundError.status });
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
