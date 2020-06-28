import { injectable, inject } from 'inversify';
import url from 'url';
import { TYPES } from '@stringsync/container';
import { ContainerConfig } from '@stringsync/config';
import { User } from '@stringsync/domain';

@injectable()
export class NotificationService {
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
      from: 'StringSync <info@stringsync.com>',
      to: user.email,
      html: `
        <p>
          Please confirmation your email for <a href=${confirmHref}>StringSync<a/>
        </p>
      `,
    };
  }
}
