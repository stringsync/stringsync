import graphqlHTTP from 'express-graphql';
import { createResolverCtx, GlobalCtx } from '../../util/ctx';
import { GraphQLSchema } from 'graphql';
import { Handler } from 'express';

export const withGraphQL = (
  gctx: GlobalCtx,
  schema: GraphQLSchema
): Handler => (req, res) => {
  const graphqlHttpMiddleware = graphqlHTTP({
    schema,
    graphiql: true,
    context: createResolverCtx(gctx, req as any, res),
  });
  return graphqlHttpMiddleware(req, res);
};
