import { GraphQLSchema, GraphQLObjectType } from 'graphql';

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQuery',
    fields: () => ({}),
  }),
  mutation: new GraphQLObjectType({
    name: 'RootMutation',
    fields: () => ({}),
  }),
});
