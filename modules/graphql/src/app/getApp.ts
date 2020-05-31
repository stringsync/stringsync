import { Container } from 'inversify';
import express from 'express';

export const getApp = (container: Container) => {
  const app = express();

  app.get('/health', (req, res) => {
    res.send('ok');
  });

  return app;
};
