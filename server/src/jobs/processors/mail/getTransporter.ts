import { GlobalCtx } from '../../../ctx';
import { createTestAccount, createTransport } from 'nodemailer';

export const getTransporter = async (ctx: GlobalCtx) => {
  switch (ctx.config.NODE_ENV) {
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
      throw new Error(`no transporter for NODE_ENV: ${ctx.config.NODE_ENV}`);
  }
};
