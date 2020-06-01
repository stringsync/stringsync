import express from 'express';
import cors from 'cors';
import { Container } from 'inversify';
import { getHealth } from './routes';
import { withSession, withGraphQL } from './middlewares';
import { generateSchema } from '../schema';

export const getApp = (container: Container) => {
  const app = express();
  const schema = generateSchema(container);

  app.set('trust proxy', 1);

  app.use(cors());

  app.use('/graphql', withSession(container));
  app.use('/graphql', withGraphQL(container, schema));

  app.get('/health', getHealth(container));

  return app;
};
