import express from 'express';
import cors from 'cors';
import { GlobalCtx } from '../util/ctx';
import { checkHealth } from './checkHealth';
import { graphqlMiddleware } from './graphqlMiddleware';

export const getApp = (ctx: GlobalCtx) => {
  const app = express();

  app.use(cors());

  app.use('/graphql', graphqlMiddleware(ctx));

  app.get('/health', checkHealth(ctx));

  return app;
};
