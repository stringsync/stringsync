import { NOT_IMPLEMENTED_MSG, UNKNOWN_ERROR_MSG } from './constants';
import { ErrorCode } from './types';

export class StringSyncError extends Error {
  code: ErrorCode;
  isUserFacing = true;

  constructor(message: string, code: ErrorCode) {
    super(message);
    this.code = code;
  }

  get extensions() {
    return { code: this.code };
  }
}

export class UnknownError extends StringSyncError {
  constructor(message: string = UNKNOWN_ERROR_MSG) {
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
  isUserFacing = false;

  constructor(message: string) {
    super(message, ErrorCode.INTERNAL);
  }
}

export class NotImplementedError extends StringSyncError {
  isUserFacing = false;

  constructor(message: string = NOT_IMPLEMENTED_MSG) {
    super(message, ErrorCode.NOT_IMPLEMENTED);
  }
}

export class ValidationError extends StringSyncError {
  isUserFacing = true;
  ctx: any[];

  constructor(ctx: any[]) {
    super(`validation errors: ${JSON.stringify(ctx, null, 2)}`, ErrorCode.CONFLICT);
    this.ctx = ctx;
  }
}
