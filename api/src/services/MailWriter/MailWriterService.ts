import { inject, injectable } from 'inversify';
import url from 'url';
import { Config } from '../../config';
import { User } from '../../domain';
import { TYPES } from '../../inversify.constants';
import { Mail } from '../../util';

@injectable()
export class MailWriterService {
  constructor(@inject(TYPES.Config) private config: Config) {}

  writeConfirmationEmail(user: User): Mail {
    const confirmHref = this.getHref('/confirm-email', { confirmationToken: user.confirmationToken });

    return {
      subject: 'Confirm your email for stringsync',
      from: this.config.INFO_EMAIL,
      to: user.email,
      html: `<p>Please confirm your email for <a href="${confirmHref}">stringsync</a>.</p>`,
    };
  }

  writeResetPasswordEmail(user: User): Mail {
    if (!user.resetPasswordToken) {
      throw new Error('user must have a reset password token');
    }

    const resetPasswordHref = this.getHref('/reset-password', {
      email: user.email,
      'reset-password-token': user.resetPasswordToken,
    });

    return {
      subject: 'Reset your password for stringsync',
      from: this.config.INFO_EMAIL,
      to: user.email,
      html: `<p>Reset your password at <a href="${resetPasswordHref}">stringsync</a>.</p>`,
    };
  }

  private getHref<T extends NodeJS.Dict<string | number | boolean | string[] | number[] | boolean[] | null>>(
    pathname: string,
    query: T
  ): string {
    const origin = new URL(`https://${this.config.WEB_UI_CDN_DOMAIN_NAME}`);
    return url.format({
      protocol: origin.protocol,
      hostname: origin.hostname,
      port: origin.port,
      pathname,
      query,
    });
  }
}
