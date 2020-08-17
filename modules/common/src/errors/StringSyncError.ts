import { ErrorCode } from './types';

export class StringSyncError extends Error {
  code: ErrorCode;

  constructor(message: string, code: ErrorCode) {
    super(message);
    this.code = code;
  }

  get extensions() {
    return { code: this.code };
  }
}

export class UnknownError extends StringSyncError {
  constructor(message: string) {
    super(message, ErrorCode.UNKNOWN);
  }
}

export class ConflictError extends StringSyncError {
  constructor(message: string) {
    super(message, ErrorCode.CONFLICT);
  }
}

export class ForbiddenError extends StringSyncError {
  constructor(message: string) {
    super(message, ErrorCode.FORBIDDEN);
  }
}

export class BadRequestError extends StringSyncError {
  constructor(message: string) {
    super(message, ErrorCode.BAD_REQUEST);
  }
}

export class NotFoundError extends StringSyncError {
  constructor(message: string) {
    super(message, ErrorCode.NOT_FOUND);
  }
}

export class InternalError extends StringSyncError {
  constructor(message: string) {
    super(message, ErrorCode.INTERNAL);
  }
}
