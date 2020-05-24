import {
  compose,
  AuthRequirements,
  WhoamiInput,
  WhoamiOutput,
} from '../../../../common';
import { withAuthRequirement } from '../../../middlewares';
import { ResolverCtx } from '../../../../util/ctx';
import { Resolver } from '../../../types';

export const middleware = compose(withAuthRequirement(AuthRequirements.NONE));

export const resolver: Resolver<
  Promise<WhoamiOutput>,
  undefined,
  WhoamiInput,
  ResolverCtx
> = async (src, args, rctx, info) => {
  const pk = rctx.req.session.user.id;
  return await rctx.dataLoaders.usersById.load(pk);
};

export const whoami = middleware(resolver);
