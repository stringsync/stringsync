import { MailQueueData } from './types';
import { Processor, Job } from 'bullmq';
import { GlobalCtx } from '../../../util/ctx';
import { getTransporter } from './getTransporter';
import { getTestMessageUrl } from 'nodemailer';

export const getMailJobProcessor = (gctx: GlobalCtx): Processor => async (
  job: Job<MailQueueData, Promise<void>>
) => {
  const transporter = await getTransporter(gctx);
  const info = await transporter.sendMail(job.data);

  gctx.logger.info(`message sent: ${info.messageId}`);
  gctx.logger.info(`preview url: ${getTestMessageUrl(info)}`);
};
