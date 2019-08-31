import { GraphQLList, GraphQLFieldConfigMap, GraphQLString } from 'graphql';
import { User } from '../types/User';
import { StringSync } from '@/types/string-sync';

export const user: GraphQLFieldConfigMap<
  undefined,
  StringSync.ResolverContext
> = {
  user: {
    type: User,
    description: 'Gets a user by id',
    args: {
      id: { type: GraphQLString },
    },
    resolve: (parent, args, ctx, info) => {
      return ctx.prisma.user({ id: args.id });
    },
  },
};
