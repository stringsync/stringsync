declare namespace jest {
  interface Matchers<R> {
    toHaveHttpStatus(httpStatus: import('@stringsync/common').HttpStatus): R;
    toHaveErrorCode(errorCode: import('@stringsync/common').ErrorCode): R;
  }
}
