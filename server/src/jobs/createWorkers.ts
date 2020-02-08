import { MAIL_QUEUE } from './constants';
import { Workers } from './types';
import { WorkerOptions, Worker } from 'bullmq';
import { Redis } from 'ioredis';
import { Logger } from 'winston';
import { getMailJobProcessor } from './getMailJobProcessor';

export const createWorkers = (redis: Redis, logger: Logger): Workers => {
  const workerOptions: Readonly<WorkerOptions> = Object.freeze({
    connection: redis,
  });

  return {
    [MAIL_QUEUE]: new Worker(
      MAIL_QUEUE,
      getMailJobProcessor(logger),
      workerOptions
    ),
  };
};
