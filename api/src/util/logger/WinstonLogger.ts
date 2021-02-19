import { inject, injectable } from 'inversify';
import winston from 'winston';
import { Config } from '../../config';
import { TYPES } from '../../inversify.constants';
import { Logger } from './types';

@injectable()
export class WinstonLogger implements Logger {
  logger: winston.Logger;

  constructor(@inject(TYPES.Config) public config: Config) {
    const formats = new Array<winston.Logform.Format>();
    if (config.NODE_ENV !== 'production') {
      formats.push(winston.format.colorize());
    }
    formats.push(winston.format.simple());

    this.logger = winston.createLogger({
      level: config.LOG_LEVEL,
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(...formats),
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
