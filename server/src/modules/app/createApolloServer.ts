import { Db } from '../../db/createDb';
import { ApolloServer } from 'apollo-server-express';
import { GraphQLSchema, GraphQLError, GraphQLFormattedError } from 'graphql';
import { getRequestContextCreator } from '../request-context';

export type ErrorFormatter = (
  error: GraphQLError
) => GraphQLFormattedError<Record<string, any>>;

export interface CreateApolloServerOptions {
  db: Db;
  schema: GraphQLSchema;
  formatError: ErrorFormatter;
}

export const createApolloServer = (opts: CreateApolloServerOptions) => {
  return new ApolloServer({
    schema: opts.schema,
    context: getRequestContextCreator(opts.db),
    formatError: opts.formatError,
  });
};
