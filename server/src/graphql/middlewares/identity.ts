import { Middleware } from './types';

export const identity: Middleware = (next) => (src, args, ctx, info) =>
  next(src, args, ctx, info);
