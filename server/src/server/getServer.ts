import { ApolloServer } from 'apollo-server';
import { getReqCtxCreator } from '../ctx';
import { getErrorFormatter } from './getErrorFormatter';
import { GlobalCtx } from '../ctx';
import { GraphQLSchema } from 'graphql';

export const getServer = (schema: GraphQLSchema, ctx: GlobalCtx) => {
  return new ApolloServer({
    schema,
    context: getReqCtxCreator(ctx),
    formatError: getErrorFormatter(ctx.config.NODE_ENV),
    cors: { origin: ctx.config.WEB_URI, credentials: true },
  });
};
