import express, { Handler } from 'express';
import cors from 'cors';
import { GlobalCtx } from '../util/ctx';
import { withGraphQL, withSession, withSessionUser } from './middlewares';
import { getHealth } from './routes';
import { getSchema } from '../graphql';

export const getApp = (ctx: GlobalCtx) => {
  const app = express();
  const schema = getSchema();

  // settings
  app.set('trust proxy', 1);

  // middlewares
  app.use(cors() as Handler);
  app.use('/graphql', withSession(ctx));
  app.use('/graphql', withSessionUser(ctx));
  app.use('/graphql', withGraphQL(ctx, schema));

  // routes
  app.get('/health', getHealth(ctx));

  return app;
};
