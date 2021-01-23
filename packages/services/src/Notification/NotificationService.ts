import { inject, injectable } from '@stringsync/di';
import { User } from '@stringsync/domain';
import { Mailer, UTIL_TYPES } from '@stringsync/util';
import url from 'url';
import { ServicesConfig } from '../SERVICES_CONFIG';
import { SERVICES_TYPES } from '../SERVICES_TYPES';

const TYPES = { ...SERVICES_TYPES, ...UTIL_TYPES };

@injectable()
export class NotificationService {
  constructor(
    @inject(TYPES.Mailer) public mailer: Mailer,
    @inject(TYPES.ServicesConfig) public config: ServicesConfig
  ) {}

  async sendConfirmationEmail(user: User): Promise<void> {
    const confirmHref = this.getHref('/confirm-email', { confirmationToken: user.confirmationToken });

    await this.mailer.send({
      subject: 'Confirm your email for StringSync',
      from: this.config.INFO_EMAIL,
      to: user.email,
      html: `<p>Please confirm your email for <a href="${confirmHref}">StringSync</a>.</p>`,
    });
  }

  async sendResetPasswordEmail(user: User): Promise<void> {
    if (!user.resetPasswordToken) {
      throw new Error('user must have a reset password token');
    }

    const resetPasswordHref = this.getHref('/reset-password', {
      email: user.email,
      'reset-password-token': user.resetPasswordToken,
    });

    await this.mailer.send({
      subject: 'Reset your password for StringSync',
      from: this.config.INFO_EMAIL,
      to: user.email,
      html: `<p>Reset your password at <a href="${resetPasswordHref}">StringSync</a>.</p>`,
    });
  }

  private getHref<T extends NodeJS.Dict<string | number | boolean | string[] | number[] | boolean[] | null>>(
    pathname: string,
    query: T
  ): string {
    const origin = new URL(this.config.APP_WEB_ORIGIN);
    return url.format({
      protocol: origin.protocol,
      hostname: origin.hostname,
      port: origin.port,
      pathname,
      query,
    });
  }
}
