import { inject, injectable } from '@stringsync/di';
import { Logger } from '../logger';
import { UTIL_TYPES } from '../UTIL_TYPES';
import { Mail, Mailer } from './types';

@injectable()
export class NoopMailer implements Mailer {
  logger: Logger;

  constructor(@inject(UTIL_TYPES.Logger) logger: Logger) {
    this.logger = logger;
  }

  async send(mail: Mail) {
    this.logger.info(`mail sent: ${JSON.stringify(mail)}`);
  }
}
