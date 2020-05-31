import express from 'express';
import cors from 'cors';
import { Container } from 'inversify';
import { getHealth } from './routes';
import { withSession } from './middlewares';

export const getApp = (container: Container) => {
  const app = express();

  app.set('trust proxy', 1);

  app.use(cors());
  app.use('/graphql', withSession(container));

  app.get('/health', getHealth(container));

  return app;
};
