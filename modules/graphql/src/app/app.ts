import express from 'express';
import { Container } from 'inversify';
import { HealthController } from './controllers';
import { TYPES } from '@stringsync/container';
import cors from 'cors';
import { withSession } from './middlewares';

export const app = (container: Container) => {
  const app = express();
  const healthController = container.get<HealthController>(TYPES.HealthController);

  app.set('trust proxy', 1);

  app.use(cors());

  app.get('/health', healthController.get);

  app.use('/graphql', withSession(container));

  return app;
};
