import { GraphQLObjectType } from 'graphql';

export const User = new GraphQLObjectType({
  name: 'User',
  description: 'All details of a user on the website',
  fields: () => ({}),
});
