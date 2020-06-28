import { createReqCtx } from '../../ctx';
import graphqlHTTP from 'express-graphql';
import { GraphQLSchema } from 'graphql';
import { Handler } from 'express';
import { TYPES } from '@stringsync/container';
import { ContainerConfig } from '@stringsync/config';
import { Container } from 'inversify';

export const withGraphQL = (container: Container, schema: GraphQLSchema): Handler => (req, res) => {
  const context = createReqCtx(req, res, container);
  const config = container.get<ContainerConfig>(TYPES.ContainerConfig);

  const middleware = graphqlHTTP({
    schema,
    context,
    graphiql: config.NODE_ENV !== 'production',
  });

  return middleware(req, res);
};
