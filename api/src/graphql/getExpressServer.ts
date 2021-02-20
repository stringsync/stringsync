import { altairExpress } from 'altair-express-middleware';
import cors from 'cors';
import express from 'express';
import { Config } from '../config';
import { Ctx } from './Ctx';

export const getExpressServer = (config: Config) => {
  const app = express();

  app.set('trust proxy', 1);
  app.use(cors({ origin: [config.APP_WEB_ORIGIN], credentials: true }));

  app.use((req, res, next) => {
    Ctx.bind(req);
    next();
  });

  app.get('/health', (req, res) => {
    const ctx = Ctx.get(req);
    console.log(ctx?.getReqId());
    res.send('ok');
  });

  if (config.NODE_ENV === 'development') {
    app.use('/altair', altairExpress({ endpointURL: '/graphql' }));
  }

  return app;
};
