import { Logger, UTIL } from '@stringsync/util';
import { AssociateVideoUrlJob } from './AssociateVideoUrlJob';
import { createJobsContainer, JOBS } from './JOBS';

export * from './AssociateVideoUrlJob';
export * from './JOBS';
export * from './types';

const TYPES = { ...UTIL.TYPES, ...JOBS.TYPES };

const main = async () => {
  const container = await createJobsContainer();
  const logger = container.get<Logger>(TYPES.Logger);

  const updateVideoUrlJob = container.get<AssociateVideoUrlJob>(TYPES.AssociateVideoUrlJob);
  updateVideoUrlJob.setupQueue();
  updateVideoUrlJob.setupWorker();
  await updateVideoUrlJob.runForever();

  logger.info('jobs successfully setup');
};

if (require.main === module) {
  main();
}
