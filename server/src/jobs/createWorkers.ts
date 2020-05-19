import { MAIL } from './constants';
import { Workers } from './types';
import { WorkerOptions, Worker } from 'bullmq';
import { getMailJobProcessor } from './processors';
import { GlobalCtx } from '../util/ctx';

export const createWorkers = (ctx: GlobalCtx): Workers => {
  const workerOptions: Readonly<WorkerOptions> = Object.freeze({
    connection: ctx.redis,
  });

  return {
    [MAIL]: new Worker(MAIL, getMailJobProcessor(ctx), workerOptions),
  };
};
