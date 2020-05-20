import { makeExecutableSchema } from 'graphql-tools';
import { getResolvers } from './getResolvers';
import { typeDefs } from './typeDefs';

export const getSchema = () => {
  const resolvers = getResolvers();
  return makeExecutableSchema({
    typeDefs,
    resolvers,
    allowUndefinedInResolve: false,
    resolverValidationOptions: {
      requireResolversForArgs: true,
      requireResolversForNonScalar: true,
      requireResolversForAllFields: false,
      allowResolversNotInSchema: false,
    },
  });
};
