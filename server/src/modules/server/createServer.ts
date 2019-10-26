import { Db } from '../../db/types';
import { ApolloServer } from 'apollo-server';
import { GraphQLSchema } from 'graphql';
import { getRequestContextCreator } from '../request-context';
import { Config } from '../../getConfig';
import { getErrorFormatter } from './getErrorFormatter';

export const createServer = (db: Db, schema: GraphQLSchema, config: Config) => {
  return new ApolloServer({
    schema,
    context: getRequestContextCreator(db),
    formatError: getErrorFormatter(config.NODE_ENV),
    cors: { origin: config.CLIENT_URI, credentials: true },
  });
};
