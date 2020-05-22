import { ResolverCtx } from '../../../../util/ctx';
import { IFieldResolver } from 'graphql-tools';
import { User } from '../../../../common';

export const canAccessEmail: IFieldResolver<User, ResolverCtx> = (
  src,
  args,
  ctx,
  info
): boolean => {
  const user = ctx.req.session.user;
  const isLoggedInAsDataOwner = user.isLoggedIn && user.id === src.id;
  return isLoggedInAsDataOwner;
};
