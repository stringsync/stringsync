import { SES } from 'aws-sdk';
import { inject, injectable } from 'inversify';
import { createTransport, Transporter } from 'nodemailer';
import { TYPES } from '../../inversify.constants';
import { Logger } from '../logger';
import { Mail, Mailer } from './types';

@injectable()
export class Nodemailer implements Mailer {
  ses: SES;
  transporter: Transporter;

  constructor(@inject(TYPES.Logger) public logger: Logger) {
    this.ses = new SES();
    this.transporter = createTransport({
      SES: this.ses,
    });
  }

  async send(mail: Mail): Promise<void> {
    try {
      const result = await this.transporter.sendMail(mail);
      this.logger.info(`mail sent successfully: ${result}`);
    } catch (err) {
      // Errors sending emails are swallowed so we don't indefinitely slam the SES service.
      this.logger.error(`error sending mail: ${err}`);
    }
  }
}
