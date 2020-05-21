import { HttpStatus, Extensions } from './types';
import { HTTP_STATUSES } from './constants';

abstract class HttpStatusError extends Error {
  public static status: HttpStatus;
  public readonly extensions: Extensions;

  constructor(message: string, extensions: Extensions) {
    super(message);
    this.extensions = extensions;
  }
}

export class BadRequestError extends HttpStatusError {
  static status = HTTP_STATUSES.BAD_REQUEST;

  constructor(message: string) {
    super(message, { status: BadRequestError.status });
  }
}

export class ForbiddenError extends HttpStatusError {
  static status = HTTP_STATUSES.FORBIDDEN;

  constructor(message: string) {
    super(message, { status: ForbiddenError.status });
  }
}

export class NotFoundError extends HttpStatusError {
  static status = HTTP_STATUSES.NOT_FOUND;

  constructor(message: string) {
    super(message, { status: NotFoundError.status });
  }
}
