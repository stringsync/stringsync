import { injectable, inject } from 'inversify';
import url from 'url';
import { TYPES } from '@stringsync/container';
import { ContainerConfig } from '@stringsync/config';
import { User } from '@stringsync/domain';
import { BadRequestError } from '@stringsync/common';

@injectable()
export class NotificationService {
  static INFO_EMAIL = 'StringSync <info@stringsync.com>';

  config: ContainerConfig;

  constructor(@inject(TYPES.ContainerConfig) config: ContainerConfig) {
    this.config = config;
  }

  async sendConfirmationEmail(user: User): Promise<void> {
    const confirmHref = url.format({
      protocol: 'https',
      hostname: this.config.WEB_URI,
      pathname: 'confirm-email',
      query: { confirmationToken: user.confirmationToken },
    });

    const emailOptions = {
      from: NotificationService.INFO_EMAIL,
      to: user.email,
      html: `
        <p>
          Please confirm your email for <a href="${confirmHref}">StringSync<a/>
        </p>
      `,
    };
  }

  async sendResetPasswordEmail(user: User): Promise<void> {
    if (!user.resetPasswordToken) {
      throw new Error('user must have a reset password token');
    }

    const resetPasswordHref = url.format({
      protocol: 'https',
      hostname: this.config.WEB_URI,
      pathname: 'reset-password',
      query: { resetPasswordToken: user.resetPasswordToken },
    });

    const emailOptions = {
      from: NotificationService.INFO_EMAIL,
      to: user.email,
      html: `
        <p>
          Reset your password at <a href="${resetPasswordHref}">StringSync<a/>
        </p>
      `,
    };
  }
}
