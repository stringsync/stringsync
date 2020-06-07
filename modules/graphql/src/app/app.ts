import express from 'express';
import { Container } from 'inversify';
import { HealthController } from './controllers';
import { TYPES } from '@stringsync/container';

export const app = (container: Container) => {
  const app = express();

  const healthController = container.get<HealthController>(TYPES.HealthController);
  app.get('/health', healthController.get);

  return app;
};
