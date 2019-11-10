import { ResolverGuard } from './types';
import { ForbiddenError } from 'apollo-server';

export const authenticated: ResolverGuard = (resolver) => async (
  parent,
  args,
  ctx,
  info
) => {
  if (!ctx.auth.isLoggedIn) {
    throw new ForbiddenError('must be logged in');
  }
  return await resolver(parent, args, ctx, info);
};
