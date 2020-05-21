import { UserInput, User } from '../../common';
import { ResolverCtx } from '../../util/ctx';
import { IFieldResolver } from 'graphql-tools';

type Resolver = IFieldResolver<undefined, ResolverCtx, { input: UserInput }>;

export const user: Resolver = async (src, args, ctx): Promise<User | null> => {
  return await ctx.dataLoaders.usersById.load(args.input.id);
};
