import { User, UserInput } from '../types/User';
import { Context } from '@/types/context';
import { GraphQLFieldConfigMap } from 'graphql';

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
