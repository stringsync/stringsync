import { inject, injectable } from '@stringsync/di';
import winston from 'winston';
import { UtilConfig } from '../config';
import { UTIL_TYPES } from '../UTIL_TYPES';
import { Logger } from './types';

const TYPES = { ...UTIL_TYPES };

@injectable()
export class WinstonLogger implements Logger {
  logger: winston.Logger;

  constructor(@inject(TYPES.UtilConfig) public config: UtilConfig) {
    this.logger = winston.createLogger({
      level: config.LOG_LEVEL,
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
        }),
      ],
    });
  }

  error(msg: string) {
    this.logger.error(msg);
  }

  info(msg: string) {
    this.logger.info(msg);
  }

  warn(msg: string) {
    this.logger.warn(msg);
  }

  debug(msg: string) {
    this.logger.debug(msg);
  }
}
