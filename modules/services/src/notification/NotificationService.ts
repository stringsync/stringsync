import { injectable, inject } from 'inversify';
import url from 'url';
import { TYPES } from '@stringsync/container';
import { ContainerConfig } from '@stringsync/config';

@injectable()
export class NotificationService {
  readonly config: ContainerConfig;

  constructor(@inject(TYPES.ContainerConfig) config: ContainerConfig) {
    this.config = config;
  }

  async sendConfirmationEmail(to: string, confirmationToken: string): Promise<void> {
    const confirmHref = url.format({
      protocol: 'https',
      hostname: this.config.WEB_URI,
      pathname: 'confirm-email',
      query: { confirmationToken },
    });

    const emailOptions = {
      from: 'StringSync <info@stringsync.com>',
      to,
      html: `
        <p>
          Please confirmation your email for <a href=${confirmHref}>StringSync<a/>
        </p>
      `,
    };
  }
}
