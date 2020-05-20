import { UserInput, User } from '../../../common';
import { GraphQLCtx } from '../util/ctx';
import { IFieldResolver } from 'graphql-tools';

type UserResolver = IFieldResolver<undefined, GraphQLCtx, { input: UserInput }>;

export const user: UserResolver = async (
  src,
  args,
  ctx
): Promise<User | null> => {
  return await ctx.dataLoaders.usersById.load(args.input.id);
};
