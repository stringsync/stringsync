import { createContainer } from '@stringsync/di/dist';
import { Logger, UTIL_TYPES } from '@stringsync/util';
import { AssociateVideoUrlJob } from './AssociateVideoUrlJob';
import { JOBS } from './JOBS';
import { JobsConfig } from './JOBS_CONFIG';
import { JOBS_TYPES } from './JOBS_TYPES';
import { onExit } from './util';

export * from './AssociateVideoUrlJob';
export * from './JOBS';
export * from './JOBS_CONFIG';
export * from './JOBS_TYPES';
export * from './types';

const TYPES = { ...UTIL_TYPES, ...JOBS_TYPES };

const MAX_TEARDOWN_WAIT_MS = 10000;

const main = async () => {
  const { container, teardown } = await createContainer(JOBS);
  const config = container.get<JobsConfig>(TYPES.JobsConfig);
  const logger = container.get<Logger>(TYPES.Logger);

  if (config.NODE_ENV === 'production') {
    onExit(teardown, MAX_TEARDOWN_WAIT_MS);
  }

  const updateVideoUrlJob = container.get<AssociateVideoUrlJob>(TYPES.AssociateVideoUrlJob);
  updateVideoUrlJob.setupQueue();
  updateVideoUrlJob.setupWorker();
  await updateVideoUrlJob.runForever();

  logger.info('jobs successfully setup');
};

if (require.main === module) {
  main();
}
