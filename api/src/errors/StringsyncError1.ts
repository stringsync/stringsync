import { NOT_IMPLEMENTED_MSG, UNKNOWN_ERROR_MSG } from './constants';
import { ErrorCode } from './types';

export class StringsyncError extends Error {
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

export class UnknownError extends StringsyncError {
  constructor(message: string = UNKNOWN_ERROR_MSG) {
    super(message, ErrorCode.UNKNOWN);
  }
}

export class ConflictError extends StringsyncError {
  constructor(message: string) {
    super(message, ErrorCode.CONFLICT);
  }
}

export class ForbiddenError extends StringsyncError {
  constructor(message: string) {
    super(message, ErrorCode.FORBIDDEN);
  }
}

export class BadRequestError extends StringsyncError {
  constructor(message: string) {
    super(message, ErrorCode.BAD_REQUEST);
  }
}

export class NotFoundError extends StringsyncError {
  constructor(message: string) {
    super(message, ErrorCode.NOT_FOUND);
  }
}

export class InternalError extends StringsyncError {
  isUserFacing = false;

  constructor(message: string) {
    super(message, ErrorCode.INTERNAL);
  }
}

export class NotImplementedError extends StringsyncError {
  isUserFacing = false;

  constructor(message: string = NOT_IMPLEMENTED_MSG) {
    super(message, ErrorCode.NOT_IMPLEMENTED);
  }
}

export class ValidationError extends StringsyncError {
  isUserFacing = true;
  details: string[];

  constructor(details: string[]) {
    super(`validation errors:\n${details.map((detail) => `\t${detail}`).join('\n')}`, ErrorCode.INVALID);
    this.details = details;
  }
}
