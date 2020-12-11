import { inject, injectable } from '@stringsync/di';
import { HealthCheckerService, SERVICES } from '@stringsync/services';
import { RequestHandler } from 'express';
import { Controller } from './types';

const TYPES = { ...SERVICES.TYPES };

@injectable()
export class HealthController implements Controller {
  healthCheckerService: HealthCheckerService;

  constructor(@inject(TYPES.HealthCheckerService) healthCheckerService: HealthCheckerService) {
    this.healthCheckerService = healthCheckerService;
  }

  get: RequestHandler = async (req, res) => {
    await this.healthCheckerService.checkHealth();
    res.send('ok');
  };
}
