import { Middleware } from './types';

export const identity: Middleware<any, any, any, any> = (next) => (
  src,
  args,
  ctx,
  info
) => {
  return next(src, args, ctx, info);
};
