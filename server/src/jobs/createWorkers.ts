import { MAIL } from './constants';
import { Workers } from './types';
import { WorkerOptions, Worker } from 'bullmq';
import { getMailJobProcessor } from './processors';
import { GlobalCtx } from '../util/ctx';

export const createWorkers = (gctx: GlobalCtx): Workers => {
  const workerOptions: Readonly<WorkerOptions> = Object.freeze({
    connection: gctx.redis,
  });

  return {
    [MAIL]: new Worker(MAIL, getMailJobProcessor(gctx), workerOptions),
  };
};
