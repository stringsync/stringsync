declare namespace jest {
  interface Matchers<R> {
    toHaveErrorCode(errorCode: import('@stringsync/common').ErrorCode): R;
  }
}
