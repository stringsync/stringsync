import { Logger } from './types';
import winston from 'winston';

export class WinstonLogger implements Logger {
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
