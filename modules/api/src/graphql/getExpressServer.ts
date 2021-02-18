import { altairExpress } from 'altair-express-middleware';
import cors from 'cors';
import express from 'express';
import { Config } from '../config';

export const getExpressServer = (config: Config) => {
  const app = express();

  app.set('trust proxy', 1);
  app.use(cors({ origin: [config.APP_WEB_ORIGIN], credentials: true }));

  app.get('/health', (req, res) => {
    res.send('ok');
  });

  if (config.NODE_ENV === 'development') {
    app.use('/altair', altairExpress({ endpointURL: '/graphql' }));
  }

  return app;
};
