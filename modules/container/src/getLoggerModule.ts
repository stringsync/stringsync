import { ContainerModule } from 'inversify';
import { ContainerConfig } from '@stringsync/config';

import { TYPES } from '@stringsync/container';
import { Logger } from './logger';

export const getLoggerModule = (config: ContainerConfig, logger: Logger) =>
  new ContainerModule((bind) => {
    bind<Logger>(TYPES.Logger).toConstantValue(logger);
  });
