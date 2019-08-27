import { GraphQLList, GraphQLFieldConfigMap } from 'graphql';
import { User } from '../types/User';
import { Context } from '@/types/context';

export const users: GraphQLFieldConfigMap<undefined, Context> = {
  users: {
    type: new GraphQLList(User),
    description: 'Get a list of users',
    args: {},
    resolve: (parent, args, ctx, info) => {
      return ctx.prisma.users();
    },
  },
};
