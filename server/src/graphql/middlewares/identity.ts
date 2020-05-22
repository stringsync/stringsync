import { Middleware } from './types';

export const identity: Middleware = (next) => (src, args, ctx, info) => {
  return next(src, args, ctx, info);
};
