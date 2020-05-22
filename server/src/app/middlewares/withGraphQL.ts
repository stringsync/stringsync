import { Middleware } from './types';
import graphqlHTTP from 'express-graphql';
import { createResolverCtx } from '../../util/ctx';
import { GraphQLSchema } from 'graphql';

export const withGraphQL = (schema: GraphQLSchema): Middleware => (ctx) => (
  req,
  res
) => {
  const graphqlHttpMiddleware = graphqlHTTP({
    schema,
    graphiql: true,
    context: createResolverCtx(ctx, req, res),
  });
  return graphqlHttpMiddleware(req, res);
};
