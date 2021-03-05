declare namespace jest {
  interface Matchers<R> {
    toHaveErrorCode(errorCode: import('../errors').ErrorCode): R;
  }
}
