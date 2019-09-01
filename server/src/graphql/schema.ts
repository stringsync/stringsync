import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import { users } from './queries/users';
import { user } from './queries/user';
import { signup } from './mutations/signup';
import { login } from './mutations/login';

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
      ...signup,
      ...login,
    }),
  }),
});
