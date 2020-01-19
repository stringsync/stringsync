import { Db } from '../db';
import { ApolloServer } from 'apollo-server';
import { GraphQLSchema } from 'graphql';
import { getRequestContextCreator } from '../request-context';
import { Config } from '../config';
import { getErrorFormatter } from './getErrorFormatter';

export const getServer = (db: Db, schema: GraphQLSchema, config: Config) => {
  return new ApolloServer({
    schema,
    context: getRequestContextCreator(db),
    formatError: getErrorFormatter(config.NODE_ENV),
    cors: { origin: config.WEB_URI, credentials: true },
  });
};
