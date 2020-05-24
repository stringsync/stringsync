import { GlobalCtx } from '../../../util/ctx';
import { createTestAccount, createTransport } from 'nodemailer';

export const getTransporter = async (gctx: GlobalCtx) => {
  switch (gctx.config.NODE_ENV) {
    case 'development':
      const testAccount = await createTestAccount();
      return createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    case 'test':
      return createTransport({});
    default:
      throw new Error(`no transporter for NODE_ENV: ${gctx.config.NODE_ENV}`);
  }
};
