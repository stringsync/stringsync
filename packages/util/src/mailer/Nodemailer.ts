import { injectable } from '@stringsync/di';
import { SES } from 'aws-sdk';
import { createTransport, Transporter } from 'nodemailer';
import { UTIL_TYPES } from '../UTIL_TYPES';
import { Mail, Mailer } from './types';

const TYPES = { ...UTIL_TYPES };

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
