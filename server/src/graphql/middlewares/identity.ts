import { Middleware } from './types';

export const identity: Middleware<any, any, any, any> = (next) => (
  src,
  args,
  rctx,
  info
) => {
  return next(src, args, rctx, info);
};
