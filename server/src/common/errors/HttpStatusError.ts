import { HttpStatus, ErrorObject } from './types';

export class HttpStatusError extends Error {
  public readonly status: HttpStatus;
  public readonly errors: ErrorObject[];

  constructor(status: HttpStatus, ...errors: ErrorObject[]) {
    super();
    this.status = status;
    this.errors = errors;
  }
}
