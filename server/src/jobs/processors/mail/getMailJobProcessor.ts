import { MailQueueData } from './types';
import { Processor, Job } from 'bullmq';
import { GlobalCtx } from '../../../ctx';
import { getTransporter } from './getTransporter';
import { getTestMessageUrl } from 'nodemailer';

export const getMailJobProcessor = (ctx: GlobalCtx): Processor => async (
  job: Job<MailQueueData, Promise<void>>
) => {
  const transporter = await getTransporter(ctx);
  const info = await transporter.sendMail(job.data);

  ctx.logger.info(`message sent: ${info.messageId}`);
  ctx.logger.info(`preview url: ${getTestMessageUrl(info)}`);
};
