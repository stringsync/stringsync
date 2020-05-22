import {
  compose,
  AuthRequirements,
  WhoamiInput,
  WhoamiOutput,
} from '../../../common';
import { withAuthRequirement } from '../../middlewares';
import { IFieldResolver } from 'graphql-tools';
import { ResolverCtx } from '../../../util/ctx';

export const middleware = compose(withAuthRequirement(AuthRequirements.NONE));

export const resolver: IFieldResolver<
  undefined,
  ResolverCtx,
  WhoamiInput
> = async (src, args, ctx, info): Promise<WhoamiOutput> => {
  const pk = ctx.req.session.user.id;
  return await ctx.dataLoaders.usersById.load(pk);
};

export const whoami = middleware(resolver);
