import { compose, AuthRequirements, User, Notation } from '../../../common';
import { withAuthRequirement } from '../../middlewares';
import { IFieldResolver } from 'graphql-tools';
import { ResolverCtx } from '../../../util/ctx';

export const middleware = compose(withAuthRequirement(AuthRequirements.NONE));

export const resolver: IFieldResolver<User, ResolverCtx> = async (
  src,
  args,
  ctx,
  info
): Promise<Notation[]> => {
  return await ctx.dataLoaders.notationsByUserId.load(src.id);
};

export const notations = middleware(resolver);
