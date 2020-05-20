import { Handler } from '../types';
import graphqlHTTP from 'express-graphql';

export const graphqlMiddleware: Handler = (ctx) => (req, res) => {
  const context = { ...ctx };
  const graphqlHttpMiddleware = graphqlHTTP({
    schema: ctx.schema,
    graphiql: true,
    context,
  });
  return graphqlHttpMiddleware(req, res);
};
