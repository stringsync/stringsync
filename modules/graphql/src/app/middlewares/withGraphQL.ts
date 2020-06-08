import graphqlHTTP from 'express-graphql';
import { GraphQLSchema } from 'graphql';
import { Handler } from 'express';
import { TYPES } from '@stringsync/container';
import { ContainerConfig } from '@stringsync/config';
import { Container } from 'inversify';

export const withGraphQL = (container: Container, schema: GraphQLSchema): Handler => (req, res) => {
  const config = container.get<ContainerConfig>(TYPES.ContainerConfig);
  const reqAt = new Date();

  const middleware = graphqlHTTP({
    schema,
    graphiql: config.NODE_ENV !== 'production',
    context: { req, res, reqAt },
  });

  return middleware(req, res);
};
