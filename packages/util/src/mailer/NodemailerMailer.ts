import { injectable } from '@stringsync/di';
import { createTransport, Transporter } from 'nodemailer';
import { Mail, Mailer } from './types';

@injectable()
export class Nodemailer implements Mailer {
  transporter: Transporter;

  constructor() {
    this.transporter = createTransport({});
  }

  async send(mail: Mail): Promise<void> {
    await this.transporter.sendMail(mail);
  }
}
