import { Config } from '../config';
import { ContainerModule } from 'inversify';
import { TYPES } from '@stringsync/common';
import { HealthCheckerService } from '@stringsync/services';

export const getServicesModule = (config: Config) =>
  new ContainerModule(async (bind) => {
    bind<HealthCheckerService>(TYPES.HealthCheckerService).to(HealthCheckerService);
  });
