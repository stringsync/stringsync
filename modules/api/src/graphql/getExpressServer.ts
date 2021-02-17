import express from 'express';
import { ServerConfig } from '../config';

export const getExpressServer = (config: ServerConfig) => {
  const app = express();

  app.get('/health', (req, res) => {
    res.send('ok');
  });

  return app;
};
