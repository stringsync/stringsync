import { SES } from 'aws-sdk';
import { inject, injectable } from 'inversify';
import { createTransport, Transporter } from 'nodemailer';
import { Config } from '../../config';
import { InternalError } from '../../errors';
import { TYPES } from '../../inversify.constants';
import { Logger } from '../logger';
import { SENDING_RATE_HZ } from './constants';
import { Mail, Mailer } from './types';

@injectable()
export class DevMailer implements Mailer {
  ses: SES;
  transporter: Transporter;

  constructor(@inject(TYPES.Logger) public logger: Logger, @inject(TYPES.Config) public config: Config) {
    this.ses = new SES();
    this.transporter = createTransport({
      SES: this.ses,
      sendingRate: SENDING_RATE_HZ,
    });
  }

  async send(mail: Mail): Promise<void> {
    const to = this.config.DEV_EMAIL;
    if (!to) {
      throw new InternalError('missing config: DEV_EMAIL');
    }

    const oldMail = mail;
    const newMail = { ...mail, to };

    this.logger.info(`redirecting email from '${oldMail.to}', to: '${newMail.to}'`);
    this.logger.info(`sending mail: ${JSON.stringify(newMail, null, 2)}`);

    try {
      const result = await this.transporter.sendMail({ ...newMail, sender: newMail.from });
      this.logger.info(`sent mail successfully: ${result}`);
    } catch (err) {
      // Errors sending emails are swallowed so we don't indefinitely slam the SES service.
      this.logger.error(`error sending mail: ${err}`);
    }
  }
}
