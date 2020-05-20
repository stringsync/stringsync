import { Handler } from '../types';
import graphqlHTTP from 'express-graphql';

export const graphqlMiddleware: Handler = (ctx) => (req, res) => {
  const graphqlHttpMiddleware = graphqlHTTP({
    schema: ctx.schema,
    graphiql: true,
    context: {
      req,
      res,
      ...ctx,
    },
  });
  return graphqlHttpMiddleware(req, res);
};
