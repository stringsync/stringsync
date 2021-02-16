import express from 'express';
import { $config } from '../config';

export const getExpressServer = (config: $config.ServerConfig) => {
  const app = express();

  app.get('/health', (req, res) => {
    res.send('ok');
  });

  return app;
};
