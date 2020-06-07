import express from 'express';
import { Container } from 'inversify';
import { HealthController } from './controllers';
import { TYPES } from '@stringsync/container';
import cors from 'cors';
import { withSession, withGraphQL } from './middlewares';
import { generateSchema } from '../schema';
import { withSessionUser } from './middlewares/withSessionUser';

export const app = (container: Container) => {
  const app = express();
  const healthController = container.get<HealthController>(TYPES.HealthController);
  const schema = generateSchema(container);

  app.set('trust proxy', 1);

  app.use(cors());

  app.get('/health', healthController.get);

  app.use('/graphql', withSession(container));
  app.use('/graphql', withSessionUser(container));
  app.use('/graphql', withGraphQL(container, schema));

  return app;
};
