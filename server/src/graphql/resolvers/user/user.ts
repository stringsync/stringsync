import { UserInput, User, compose, AuthRequirements } from '../../../common';
import { ResolverCtx } from '../../../util/ctx';
import { IFieldResolver } from 'graphql-tools';
import { withAuthRequirement } from '../../middlewares';

export const middleware = compose(withAuthRequirement(AuthRequirements.NONE));

export const resolver: IFieldResolver<
  undefined,
  ResolverCtx,
  { input: UserInput }
> = async (src, args, ctx): Promise<User | null> => {
  return await ctx.dataLoaders.usersById.load(args.input.id);
};

export const user = middleware(resolver);
