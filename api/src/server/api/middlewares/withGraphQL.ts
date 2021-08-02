import { Handler } from 'express';
import { graphqlHTTP } from 'express-graphql';
import { GraphQLSchema } from 'graphql';
import { Logger } from '../../../util';
import { createResolverCtx } from './createResolverCtx';
import { formatError } from './formatError';

export const withGraphQL = (logger: Logger, schema: GraphQLSchema): Handler => (req, res) => {
  const middleware = graphqlHTTP({
    schema,
    context: createResolverCtx(req),
    graphiql: false,
    customFormatErrorFn: formatError(logger),
  });

  return middleware(req, res);
};
