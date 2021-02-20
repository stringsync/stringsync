import { SES } from 'aws-sdk';
import { injectable } from 'inversify';
import { createTransport, Transporter } from 'nodemailer';
import { Mail, Mailer } from './types';

@injectable()
export class Nodemailer implements Mailer {
  ses: SES;
  transporter: Transporter;

  constructor() {
    this.ses = new SES();
    this.transporter = createTransport({
      SES: this.ses,
    });
  }

  async send(mail: Mail): Promise<void> {
    await this.transporter.sendMail(mail);
  }
}
