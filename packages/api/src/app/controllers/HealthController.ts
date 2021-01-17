import { inject, injectable } from '@stringsync/di';
import { HealthCheckerService, SERVICES_TYPES } from '@stringsync/services';
import { RequestHandler } from 'express';
import { Controller } from './types';

const TYPES = { ...SERVICES_TYPES };

@injectable()
export class HealthController implements Controller {
  constructor(@inject(TYPES.HealthCheckerService) public healthCheckerService: HealthCheckerService) {}

  get: RequestHandler = async (req, res) => {
    await this.healthCheckerService.checkHealth();
    res.send('ok');
  };
}
