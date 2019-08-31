import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import { users } from './queries/users';
import { user } from './queries/user';
import { createUser } from './mutations/createUser';

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQuery',
    fields: () => ({
      ...users,
      ...user,
    }),
  }),
  mutation: new GraphQLObjectType({
    name: 'RootMutation',
    fields: () => ({
      ...createUser,
    }),
  }),
});
