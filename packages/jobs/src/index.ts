import { onExit } from '@stringsync/common';
import { createContainer } from '@stringsync/di';
import { Logger, UTIL_TYPES } from '@stringsync/util';
import { JOBS } from './JOBS';
import { JOBS_TYPES } from './JOBS_TYPES';
import { UpdateVideoUrlJob } from './UpdateVideoUrlJob';

export * from './JOBS';
export * from './JOBS_CONFIG';
export * from './JOBS_TYPES';
export * from './types';
export * from './UpdateVideoUrlJob';

const TYPES = { ...UTIL_TYPES, ...JOBS_TYPES };

const MAX_TEARDOWN_WAIT_MS = 10000;

const main = async () => {
  const { container, teardown } = await createContainer(JOBS);
  const logger = container.get<Logger>(TYPES.Logger);

  onExit(teardown, MAX_TEARDOWN_WAIT_MS);

  const updateVideoUrlJob = container.get<UpdateVideoUrlJob>(TYPES.UpdateVideoUrlJob);
  await updateVideoUrlJob.enqueue(undefined, { repeat: { every: 60000 } });
  await updateVideoUrlJob.work();

  logger.info('jobs setup');
};

if (require.main === module) {
  main();
}
