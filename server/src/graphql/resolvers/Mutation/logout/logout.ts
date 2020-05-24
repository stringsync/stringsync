import {
  LogoutOutput,
  compose,
  AuthRequirements,
  LogoutInput,
} from '../../../../common/';
import { ResolverCtx } from '../../../../util/ctx';
import { getNullSessionUser } from '../../../../util/session';
import { NotFoundError } from '../../../../common/errors';
import { withAuthRequirement } from '../../../middlewares';
import { Resolver } from '../../../types';

export const middleware = compose(
  withAuthRequirement(AuthRequirements.LOGGED_IN)
);

export const resolver: Resolver<
  Promise<LogoutOutput>,
  undefined,
  LogoutInput,
  ResolverCtx
> = async (src, args, rctx) => {
  const pk = rctx.req.session.user.id;
  const user = await rctx.dataLoaders.usersById.load(pk);

  if (!user) {
    throw new NotFoundError('user not found');
  }

  rctx.req.session.user = getNullSessionUser();

  return { user };
};

export const logout = middleware(resolver);
