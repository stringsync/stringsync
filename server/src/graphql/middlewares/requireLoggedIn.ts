import { Middleware } from './types';
import { ForbiddenError } from '../../common/errors';

export const requireLoggedIn: Middleware = (next) => async (
  src,
  args,
  ctx,
  info
) => {
  if (!ctx.req.session.user.isLoggedIn) {
    throw new ForbiddenError('must be logged in');
  }
  next(src, args, ctx, info);
};
