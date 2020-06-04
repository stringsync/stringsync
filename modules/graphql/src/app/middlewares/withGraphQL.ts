import graphqlHTTP from 'express-graphql';
import { Container } from 'inversify';
import { GraphQLSchema } from 'graphql';
import { Handler } from 'express';
import { TYPES } from '@stringsync/container';
import { GraphqlConfig } from '@stringsync/config';

export const withGraphQL = (container: Container, schema: GraphQLSchema): Handler => (req, res) => {
  const config = container.get<GraphqlConfig>(TYPES.GraphqlConfig);

  const middleware = graphqlHTTP({
    schema,
    graphiql: config.NODE_ENV !== 'production',
    context: { container, req, res },
  });

  return middleware(req, res);
};
