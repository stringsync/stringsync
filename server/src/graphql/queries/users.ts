import { GraphQLList, GraphQLFieldConfigMap } from 'graphql';
import { User } from '../types/User';
import { StringSync } from '@/types/string-sync';

export const users: GraphQLFieldConfigMap<
  undefined,
  StringSync.ResolverContext
> = {
  users: {
    type: new GraphQLList(User),
    description: 'Get a list of users',
    args: {},
    resolve: (parent, args, ctx, info) => {
      return ctx.prisma.users();
    },
  },
};
