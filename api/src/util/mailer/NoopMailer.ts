import { inject, injectable } from 'inversify';
import { TYPES } from '../../inversify.constants';
import { Logger } from '../logger';
import { Mail, Mailer } from './types';

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
