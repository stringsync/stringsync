import { Logger, UTIL_TYPES } from '@stringsync/util';
import { AssociateVideoUrlJob } from './AssociateVideoUrlJob';
import { createJobsContainer } from './JOBS';
import { JOBS_TYPES } from './JOBS_TYPES';

export * from './AssociateVideoUrlJob';
export * from './JOBS';
export * from './JOBS_CONFIG';
export * from './JOBS_TYPES';
export * from './types';

const main = async () => {
  const container = await createJobsContainer();
  const logger = container.get<Logger>(UTIL_TYPES.Logger);

  const updateVideoUrlJob = container.get<AssociateVideoUrlJob>(JOBS_TYPES.AssociateVideoUrlJob);
  updateVideoUrlJob.setupQueue();
  updateVideoUrlJob.setupWorker();
  await updateVideoUrlJob.runForever();

  logger.info('jobs successfully setup');
};

if (require.main === module) {
  main();
}
