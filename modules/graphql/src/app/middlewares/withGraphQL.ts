import { Handler } from 'express';
import graphqlHTTP from 'express-graphql';
import { GraphQLSchema } from 'graphql';
import { Container } from 'inversify';
import { createReqCtx } from '../../ctx';
import { formatError } from './formatError';

export const withGraphQL = (container: Container, schema: GraphQLSchema): Handler => (req, res) => {
  const context = createReqCtx(req, res, container);

  const middleware = graphqlHTTP({
    schema,
    context,
    graphiql: false,
    customFormatErrorFn: formatError,
  });

  return middleware(req, res);
};
