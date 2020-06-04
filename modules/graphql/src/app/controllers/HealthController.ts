import { HealthCheckerService } from '@stringsync/services';
import { inject, injectable } from 'inversify';
import { RequestHandler } from 'express';
import { TYPES } from '@stringsync/common';
import { Controller } from './types';

@injectable()
export class HealthController implements Controller {
  readonly healthCheckerService: HealthCheckerService;

  constructor(@inject(TYPES.HealthCheckerService) healthCheckerService: HealthCheckerService) {
    this.healthCheckerService = healthCheckerService;
  }

  get: RequestHandler = async (req, res) => {
    await this.healthCheckerService.checkHealth();
    res.send('ok');
  };
}
