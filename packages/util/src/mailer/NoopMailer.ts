import { inject, injectable } from '@stringsync/di';
import { Logger } from '../logger';
import { UTIL } from '../UTIL';
import { Mail, Mailer } from './types';

const TYPES = { ...UTIL.TYPES };

@injectable()
export class NoopMailer implements Mailer {
  logger: Logger;

  constructor(@inject(TYPES.Logger) logger: Logger) {
    this.logger = logger;
  }

  async send(mail: Mail) {
    this.logger.info(`mail sent: ${JSON.stringify(mail)}`);
  }
}
