import { Middleware } from './types';
import graphqlHTTP from 'express-graphql';
import { createResolverCtx } from '../../util/ctx';

export const withGraphQL: Middleware = (ctx) => (req, res) => {
  const graphqlHttpMiddleware = graphqlHTTP({
    schema: ctx.schema,
    graphiql: true,
    context: createResolverCtx(ctx, req, res),
  });
  return graphqlHttpMiddleware(req, res);
};
