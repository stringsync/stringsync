import winston from 'winston';
import { Logger } from './types';

export class WinstonLogger implements Logger {
  static create(logLevel: string): WinstonLogger {
    return new WinstonLogger(
      winston.createLogger({
        level: logLevel,
        transports: [
          new winston.transports.Console({
            format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
          }),
        ],
      })
    );
  }

  logger: winston.Logger;

  constructor(logger: winston.Logger) {
    this.logger = logger;
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
