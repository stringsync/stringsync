import { Middleware } from './types';

export const identity: Middleware<any, any, Record<string, any>, any> = (
  next
) => (src, args, rctx, info) => {
  return next(src, args, rctx, info);
};
