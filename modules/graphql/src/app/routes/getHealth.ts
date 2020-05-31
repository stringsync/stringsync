import { HealthCheckerService } from '@stringsync/services';
import { Container } from 'inversify';
import { Handler } from 'express';
import { TYPES } from '../../container';

export const getHealth = (container: Container): Handler => async (req, res) => {
  const healthCheckerService = container.get<HealthCheckerService>(TYPES.HealthCheckerService);
  await healthCheckerService.checkHealth();
  res.send('ok');
};
