import express, { Handler } from 'express';
import cors from 'cors';
import { GlobalCtx } from '../util/ctx';
import { withGraphQL, withSession, withSessionUser } from './middlewares';
import { getHealth } from './routes';
import { getSchema } from '../graphql';

export const getApp = (gctx: GlobalCtx) => {
  const app = express();
  const schema = getSchema();

  // settings
  app.set('trust proxy', 1);

  // middlewares
  app.use(cors() as Handler);
  app.use('/graphql', withSession(gctx));
  app.use('/graphql', withSessionUser(gctx));
  app.use('/graphql', withGraphQL(gctx, schema));

  // routes
  app.get('/health', getHealth(gctx));

  return app;
};
