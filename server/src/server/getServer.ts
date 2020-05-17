import { ApolloServer } from 'apollo-server-express';
import { getReqCtxFactory } from '../ctx';
import { getErrorFormatter } from './getErrorFormatter';
import { GlobalCtx } from '../ctx';
import { GraphQLSchema } from 'graphql';
import { getExpressServer } from './getExpressServer';

export const getServer = (schema: GraphQLSchema, ctx: GlobalCtx) => {
  const expressServer = getExpressServer(ctx);

  const apolloServer = new ApolloServer({
    schema,
    debug: true,
    context: getReqCtxFactory(ctx),
    formatError: getErrorFormatter(ctx.config.NODE_ENV),
  });

  apolloServer.applyMiddleware({ app: expressServer });

  return expressServer;
};
