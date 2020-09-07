import { Transporter } from 'nodemailer';
import { Mailer, Mail } from './types';

export class NodemailerMailer implements Mailer {
  transporter: Transporter;

  constructor(transporter: Transporter) {
    this.transporter = transporter;
  }

  async send(mail: Mail): Promise<void> {
    await this.transporter.sendMail(mail);
  }
}
