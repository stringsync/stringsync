import { ContainerConfig } from '@stringsync/config';
import { TYPES, Logger } from '@stringsync/container';
import { Handler } from 'express';
import graphqlHTTP from 'express-graphql';
import { GraphQLSchema } from 'graphql';
import { Container } from 'inversify';
import { createReqCtx } from '../../ctx';
import { startListeningForChanges } from './startListeningForChanges';
import { stopListeningForChanges } from './stopListeningForChanges';

export const withGraphQL = (container: Container, schema: GraphQLSchema): Handler => (req, res) => {
  const context = createReqCtx(req, res, container);
  const config = container.get<ContainerConfig>(TYPES.ContainerConfig);
  const logger = container.get<Logger>(TYPES.Logger);

  const middleware = graphqlHTTP({ schema, context, graphiql: config.NODE_ENV !== 'production' });

  try {
    startListeningForChanges(context.container);
    middleware(req, res);
  } catch (e) {
    logger.error(e);
  }
  stopListeningForChanges(context.container);
};
