import { typeDefs } from './typeDefs';
import { makeExecutableSchema } from 'graphql-tools';
import { getResolvers } from './getResolvers';

export const getSchema = () => {
  const resolvers = getResolvers();
  return makeExecutableSchema({
    typeDefs,
    resolvers,
    resolverValidationOptions: {
      requireResolversForArgs: true,
      requireResolversForNonScalar: false,
      requireResolversForAllFields: false,
      allowResolversNotInSchema: false,
    },
  });
};
