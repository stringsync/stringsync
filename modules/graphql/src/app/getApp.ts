import { Container } from 'inversify';
import express from 'express';
import { getHealth } from './routes';

export const getApp = (container: Container) => {
  const app = express();

  app.get('/health', getHealth(container));

  return app;
};
