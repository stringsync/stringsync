import { User, UserInput } from '../types/User';
import { GraphQLFieldConfigMap } from 'graphql';
import { StringSync } from '@/types/string-sync';

export const createUser: GraphQLFieldConfigMap<
  undefined,
  StringSync.ResolverContext
> = {
  createUser: {
    type: User,
    description: 'Creates a new user',
    args: {
      userInput: { type: UserInput },
    },
    resolve: (parent, args, ctx, info) => {
      return ctx.prisma.createUser(args.userInput);
    },
  },
};
