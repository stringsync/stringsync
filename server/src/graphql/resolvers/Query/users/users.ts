import { toUser } from '../../../../data/db';
import {
  UsersInput,
  compose,
  AuthRequirements,
  UsersOutput,
} from '../../../../common';
import { ResolverCtx } from '../../../../util/ctx';
import { withAuthRequirement } from '../../../middlewares';
import { Resolver } from '../../../types';

export const middleware = compose(
  withAuthRequirement(AuthRequirements.LOGGED_IN_AS_ADMIN)
);

export const resolver: Resolver<
  Promise<UsersOutput>,
  undefined,
  UsersInput,
  ResolverCtx
> = async (src, args, rctx) => {
  const users = await rctx.db.User.findAll();
  return users.map(toUser);
};

export const users = middleware(resolver);
