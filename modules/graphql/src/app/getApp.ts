import express from 'express';
import cors from 'cors';
import { Container } from 'inversify';
import { withSession, withGraphQL } from './middlewares';
import { generateSchema } from '../schema';
import { HealthController } from './controllers';
import { TYPES } from '@stringsync/container';

export const getApp = (container: Container) => {
  const app = express();
  const schema = generateSchema(container);
  const healthController = container.get<HealthController>(TYPES.HealthController);

  app.set('trust proxy', 1);

  app.use(cors());

  app.use('/graphql', withSession(container));
  app.use('/graphql', withGraphQL(container, schema));

  app.get('/health', healthController.get);

  return app;
};
