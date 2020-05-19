import { GlobalCtx } from '../../util/ctx';
import { CONFIRMATION_MAIL } from './constants';
import url from 'url';

export const sendConfirmationMail = async (
  email: string,
  confirmationToken: string,
  ctx: GlobalCtx
) => {
  const confirmHref = url.format({
    protocol: 'http',
    hostname: ctx.config.WEB_URI,
    pathname: 'confirm-email',
    query: { confirmationToken },
  });

  await ctx.queues.MAIL.add(CONFIRMATION_MAIL, {
    from: 'StringSync <info@stringsync.com>',
    to: email,
    html: `
      <p>
        Please confirm your email for <a href=${confirmHref}>StringSync</a>.
      </p>
    `,
  });
};
