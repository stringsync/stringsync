import { Middleware } from './types';
import { transaction } from '../../data/db';

export const withTransaction: Middleware<any, any, any> = (next) => (
  src,
  args,
  ctx,
  info
) => {
  return transaction(ctx.db, () => next(src, args, ctx, info));
};
