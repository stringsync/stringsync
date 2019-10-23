import { Express, RequestHandler } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createApolloServer } from './createApolloServer';
import { Db } from '../../db/createDb';
import { GraphQLSchema } from 'graphql';
import { createErrorFormatter } from './createErrorFormatter';

export interface InstallMiddlewareOptions {
  db: Db;
  env: string;
  clientUri: string;
  schema: GraphQLSchema;
}

export const installMiddlewares = (
  app: Express,
  opts: InstallMiddlewareOptions
) => {
  const middlewares: RequestHandler[] = [
    cors({ origin: opts.clientUri, credentials: true }),
    cookieParser(),
  ];

  for (const middleware of middlewares) {
    app.use(middleware);
  }

  // apollo has a different way of being installed
  const apolloServer = createApolloServer({
    db: opts.db,
    formatError: createErrorFormatter(opts.env),
    schema: opts.schema,
  });
  apolloServer.applyMiddleware({ app, cors: false }); // do not override cors middleware
};
