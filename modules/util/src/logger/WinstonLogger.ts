import { Logger } from './types';
import winston from 'winston';

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

  winston: winston.Logger;

  constructor(winston: winston.Logger) {
    this.winston = winston;
  }

  error(msg: string) {
    this.winston.error(msg);
  }

  info(msg: string) {
    this.winston.info(msg);
  }

  warn(msg: string) {
    this.winston.warn(msg);
  }

  debug(msg: string) {
    this.winston.debug(msg);
  }
}
