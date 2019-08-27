import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLInputObjectType,
  GraphQLInt,
} from 'graphql';

export const User = new GraphQLObjectType({
  name: 'User',
  description: 'All details of a user on the website',
  fields: () => ({
    id: { type: GraphQLString },
    username: { type: GraphQLString },
    password: { type: GraphQLString },
  }),
});

export const UserInput = new GraphQLInputObjectType({
  name: 'UserInput',
  description: 'The data used to create a user',
  fields: {
    username: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
  },
});
