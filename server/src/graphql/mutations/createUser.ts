import { User, UserInput } from '../types/User';
import { GraphQLFieldConfigMap } from 'graphql';
import { Context } from '@/string-sync';

export const createUser: GraphQLFieldConfigMap<undefined, Context> = {
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
