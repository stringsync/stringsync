import graphqlHTTP from 'express-graphql';
import { createResolverCtx, GlobalCtx } from '../../util/ctx';
import { GraphQLSchema } from 'graphql';
import { Handler } from 'express';

export const withGraphQL = (ctx: GlobalCtx, schema: GraphQLSchema): Handler => (
  req,
  res
) => {
  const graphqlHttpMiddleware = graphqlHTTP({
    schema,
    graphiql: true,
    context: createResolverCtx(ctx, req as any, res),
  });
  return graphqlHttpMiddleware(req, res);
};
