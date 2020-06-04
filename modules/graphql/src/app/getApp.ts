import express from 'express';
import cors from 'cors';
import { withSession, withGraphQL } from './middlewares';
import { generateSchema } from '../schema';
import { HealthController } from './controllers';
import { Container, TYPES } from '@stringsync/container';

export const getApp = () => {
  const app = express();
  const schema = generateSchema();
  const healthController = Container.instance.get<HealthController>(TYPES.HealthController);

  app.set('trust proxy', 1);

  app.use(cors());

  app.use('/graphql', withSession());
  app.use('/graphql', withGraphQL(schema));

  app.get('/health', healthController.get);

  return app;
};
