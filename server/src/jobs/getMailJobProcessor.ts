import { MailQueueData } from './types';
import { Processor, Job } from 'bullmq';
import { createTransport } from 'nodemailer';
import { GlobalCtx } from '../ctx';

export const getMailJobProcessor = (ctx: GlobalCtx): Processor => async (
  job: Job<MailQueueData, Promise<void>>
) => {
  const transporter = createTransport({});
};
