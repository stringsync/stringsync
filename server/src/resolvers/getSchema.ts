import { importSchema } from 'graphql-import';
import { makeExecutableSchema } from 'graphql-tools';
import { getResolvers } from './getResolvers';

export const getSchema = () => {
  const typeDefs = importSchema('schema.graphql');
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
