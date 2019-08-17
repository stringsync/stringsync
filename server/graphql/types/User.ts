import { GraphQLObjectType } from 'graphql';

export const User = new GraphQLObjectType({
  name: 'User',
  description: 'All details of a user on the website',
  fields: () => ({
    // fields, such as id: { type: GraphQLInt }
  }),
});

export const UserInput = new GraphQLObjectType({
  name: 'UserInput',
  description: 'The data used to create a user',
  fields: () => ({}),
});
