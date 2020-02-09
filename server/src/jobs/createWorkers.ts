import { MAIL_QUEUE } from './constants';
import { Workers } from './types';
import { WorkerOptions, Worker } from 'bullmq';
import { getMailJobProcessor } from './getMailJobProcessor';
import { GlobalCtx } from '../ctx';

export const createWorkers = (ctx: GlobalCtx): Workers => {
  const workerOptions: Readonly<WorkerOptions> = Object.freeze({
    connection: ctx.redis,
  });

  return {
    [MAIL_QUEUE]: new Worker(
      MAIL_QUEUE,
      getMailJobProcessor(ctx),
      workerOptions
    ),
  };
};
