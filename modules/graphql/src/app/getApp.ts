import express from 'express';
import { Container } from 'inversify';

export const getApp = (container: Container) => {
  const app = express();

  app.get('/', (req, res) => {
    res.send('ok');
  });

  return app;
};
