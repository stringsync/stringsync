import { Mailer, Mail } from './types';
import { injectable, inject } from 'inversify';
import { Logger } from '../logger';
import { TYPES } from '@stringsync/container';

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
