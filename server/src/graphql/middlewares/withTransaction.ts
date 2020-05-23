import { Middleware } from './types';

export const withTransaction: Middleware<any, any, any> = (next) => (
  src,
  args,
  ctx,
  info
) => {
  return ctx.db.sequelize.transaction(
    async () => await next(src, args, ctx, info)
  );
};
