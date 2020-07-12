import { ContainerConfig } from '@stringsync/config';
import { TYPES } from '@stringsync/container';
import cors from 'cors';
import express from 'express';
import { GraphQLSchema } from 'graphql';
import { Container } from 'inversify';
import { HealthController } from './controllers';
import { withGraphQL, withSession } from './middlewares';
import { withSessionUser } from './middlewares/withSessionUser';

export const app = (container: Container, schema: GraphQLSchema) => {
  const app = express();
  const healthController = container.get<HealthController>(TYPES.HealthController);
  const config = container.get<ContainerConfig>(TYPES.ContainerConfig);

  app.set('trust proxy', 1);

  app.use(cors({ origin: [config.WEB_URI], credentials: true }));

  app.get('/health', healthController.get);

  app.use('/graphql', withSession(container));
  app.use('/graphql', withSessionUser(container));
  app.use('/graphql', withGraphQL(container, schema));

  return app;
};
