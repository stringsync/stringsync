import { inject, injectable } from 'inversify';
import winston from 'winston';
import { Config } from '../../config';
import { TYPES } from '../../inversify.constants';
import { Logger, LoggerMeta } from './types';

@injectable()
export class WinstonLogger implements Logger {
  logger: winston.Logger;
  meta: LoggerMeta = {};

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

  getMeta() {
    return this.meta;
  }

  mergeMeta(meta: LoggerMeta) {
    this.meta = { ...this.meta, ...meta };
  }

  setMeta(meta: LoggerMeta) {
    this.meta = meta;
  }

  error(msg: string) {
    this.logger.error(msg, this.meta);
  }

  info(msg: string) {
    this.logger.info(msg, this.meta);
  }

  warn(msg: string) {
    this.logger.warn(msg, this.meta);
  }

  debug(msg: string) {
    this.logger.debug(msg, this.meta);
  }
}
