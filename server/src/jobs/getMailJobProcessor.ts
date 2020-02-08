import { MailQueueData } from './types';
import { Processor, Job } from 'bullmq';
import { Logger } from 'winston';

export const getMailJobProcessor = (logger: Logger): Processor => async (
  job: Job<MailQueueData, Promise<void>>
) => {
  logger.info(job.data);
};
