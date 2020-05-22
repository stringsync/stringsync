import { ResolverCtx } from '../../../../util/ctx';
import { User } from '../../../../common';
import { Resolver } from '../../../types';

export const isDataOwner: Resolver<boolean, User> = (src, args, ctx, info) => {
  const user = ctx.req.session.user;
  const isLoggedInAsDataOwner = user.isLoggedIn && user.id === src.id;
  return isLoggedInAsDataOwner;
};
