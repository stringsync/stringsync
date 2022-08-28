declare namespace jest {
  interface Matchers<R, T = any> {
    toHaveErrorCode: T extends import('./types').Response<any, any>
      ? (errorCode: import('../errors').ErrorCode) => R
      : 'Type Error: Received must be a Response';
    toHaveTaskWithPayload: T extends import('../jobs').Job<infer P>
      ? (payload: import('../util').DeepPartial<P>) => Promise<R>
      : 'Type Error: Received must be a Job';
    toHaveTaskCount: T extends import('../jobs').Job<infer P>
      ? (count: number) => Promise<R>
      : 'Type Error: Received must be a Job';
  }
}
