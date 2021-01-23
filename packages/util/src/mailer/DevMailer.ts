import { InternalError } from '@stringsync/common';
import { inject, injectable } from '@stringsync/di';
import { SES } from 'aws-sdk';
import { createTransport, Transporter } from 'nodemailer';
import { Logger } from '../logger';
import { UtilConfig } from '../UTIL_CONFIG';
import { UTIL_TYPES } from '../UTIL_TYPES';
import { Mail, Mailer } from './types';

const TYPES = { ...UTIL_TYPES };

@injectable()
export class DevMailer implements Mailer {
  ses: SES;
  transporter: Transporter;

  constructor(@inject(TYPES.Logger) public logger: Logger, @inject(TYPES.UtilConfig) public config: UtilConfig) {
    this.ses = new SES();
    this.transporter = createTransport({
      SES: this.ses,
    });
  }

  async send(mail: Mail): Promise<void> {
    const to = this.config.DEV_EMAIL;
    if (!to) {
      throw new InternalError('missing config: DEV_EMAIL');
    }

    const oldMail = mail;
    const newMail = { ...mail, to };

    this.logger.info(`redirecting email: (${oldMail.from} -> ${oldMail.to}) / (${newMail.from} -> ${newMail.to})`);

    await this.transporter.sendMail(newMail);
  }
}
