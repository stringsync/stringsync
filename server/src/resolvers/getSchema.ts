import { makeExecutableSchema, gql } from 'apollo-server';
import { getResolvers } from './getResolvers';
import { typeDefs } from './typeDefs';

export const getSchema = () => {
  const resolvers = getResolvers();
  return makeExecutableSchema({
    typeDefs,
    resolvers,
  });
};
