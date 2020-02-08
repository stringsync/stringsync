import { Db } from '../db';
import { ApolloServer } from 'apollo-server';
import { GraphQLSchema } from 'graphql';
import { getRequestContextCreator } from '../request-context';
import { Config } from '../config';
import { getErrorFormatter } from './getErrorFormatter';
import { Logger } from 'winston';
import { Redis } from 'ioredis';

export const getServer = (
  db: Db,
  schema: GraphQLSchema,
  logger: Logger,
  redis: Redis,
  config: Config
) => {
  return new ApolloServer({
    schema,
    context: getRequestContextCreator(db, logger, redis),
    formatError: getErrorFormatter(config.NODE_ENV),
    cors: { origin: config.WEB_URI, credentials: true },
  });
};
