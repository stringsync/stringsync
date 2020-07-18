import { ContainerModule } from 'inversify';
import { ContainerConfig } from '@stringsync/config';
import * as winston from 'winston';
import { TYPES } from '@stringsync/container';
import { Logger } from './Logger';

export const getLoggerModule = (config: ContainerConfig) =>
  new ContainerModule((bind) => {
    const logger = winston.createLogger();
    bind<Logger>(TYPES.Logger).toConstantValue(logger);
  });
