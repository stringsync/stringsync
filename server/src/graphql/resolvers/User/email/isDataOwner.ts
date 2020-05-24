import { User } from '../../../../common';
import { Resolver } from '../../../types';

export const isDataOwner: Resolver<boolean, User> = (src, args, rctx, info) => {
  const user = rctx.req.session.user;
  const isLoggedInAsDataOwner = user.isLoggedIn && user.id === src.id;
  return isLoggedInAsDataOwner;
};
