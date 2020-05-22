import { compose, AuthRequirements, User, Notation } from '../../../../common';
import { withAuthRequirement } from '../../../middlewares';
import { ResolverCtx } from '../../../../util/ctx';
import { Resolver } from '../../../types';

export const middleware = compose(withAuthRequirement(AuthRequirements.NONE));

export const resolver: Resolver<Promise<Notation[]>, User> = async (
  src,
  args,
  ctx,
  info
) => {
  return await ctx.dataLoaders.notationsByUserId.load(src.id);
};

export const notations = middleware(resolver);
