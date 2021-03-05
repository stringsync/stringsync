import { Handler } from 'express';
import { graphqlHTTP } from 'express-graphql';
import { GraphQLSchema } from 'graphql';
import { createResolverCtx } from './createResolverCtx';
import { formatError } from './formatError';

export const withGraphQL = (schema: GraphQLSchema): Handler => (req, res) => {
  const middleware = graphqlHTTP({
    schema,
    context: createResolverCtx(req),
    graphiql: false,
    customFormatErrorFn: formatError,
  });

  return middleware(req, res);
};
