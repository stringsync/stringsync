import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLInputObjectType,
} from 'graphql';

export interface User {
  id: string;
  username: string;
}

export interface UserInput {
  username: string;
  password: string;
}

export const User = new GraphQLObjectType({
  name: 'User',
  description: 'All details of a user on the website',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLString) },
    username: { type: new GraphQLNonNull(GraphQLString) },
    token: { type: GraphQLString },
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
