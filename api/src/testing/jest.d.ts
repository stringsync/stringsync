declare namespace jest {
  interface Matchers<R> {
    toHaveErrorCode(errorCode: import('../errors').ErrorCode): R;
    toHaveTask(task: import('../jobs').Task<Payload>): Promise<R>;
  }
}
