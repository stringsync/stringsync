import express, { Handler } from 'express';
import cors from 'cors';
import { GlobalCtx } from '../util/ctx';
import { withGraphQL, withSession, withSessionUser } from './middlewares';
import { getHealth } from './routes';

export const getApp = (ctx: GlobalCtx) => {
  const app = express();

  // settings
  app.set('trust proxy', 1);

  // middlewares
  app.use(cors() as Handler);
  app.use(withSession(ctx));
  app.use(withSessionUser(ctx));
  app.use('/graphql', withGraphQL(ctx));

  // routes
  app.get('/health', getHealth(ctx));

  return app;
};
