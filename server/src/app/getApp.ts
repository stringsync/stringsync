import express from 'express';
import cors from 'cors';
import { GlobalCtx } from '../util/ctx';
import { checkHealth } from './checkHealth';
import { graphqlMiddleware } from './graphqlMiddleware';
import { authMiddleware } from './authMiddleware';

export const getApp = (ctx: GlobalCtx) => {
  const app = express();

  app.set('trust proxy', true);

  app.use(cors());

  app.use(authMiddleware(ctx));

  app.use('/graphql', graphqlMiddleware(ctx));

  app.get('/health', checkHealth(ctx));

  return app;
};
