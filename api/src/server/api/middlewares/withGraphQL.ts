import { Handler } from 'express';
import { graphqlHTTP } from 'express-graphql';
import { GraphQLSchema } from 'graphql';
import { Logger } from '../../../util';
import { createResolverCtx } from './createResolverCtx';

export const withGraphQL = (logger: Logger, schema: GraphQLSchema): Handler => (req, res) => {
  const middleware = graphqlHTTP({
    schema,
    context: createResolverCtx(req),
    graphiql: false,
  });

  return middleware(req, res);
};
