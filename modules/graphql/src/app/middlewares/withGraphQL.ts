import graphqlHTTP from 'express-graphql';
import { GraphQLSchema } from 'graphql';
import { Handler } from 'express';
import { Container, TYPES } from '@stringsync/container';
import { ContainerConfig } from '@stringsync/config';

export const withGraphQL = (schema: GraphQLSchema): Handler => (req, res) => {
  const config = Container.instance.get<ContainerConfig>(TYPES.ContainerConfig);

  const middleware = graphqlHTTP({
    schema,
    graphiql: config.NODE_ENV !== 'production',
    context: { req, res },
  });

  return middleware(req, res);
};
