import { getApiConfig } from '@stringsync/config';
import { TYPES } from '@stringsync/di';
import { Logger } from '@stringsync/util';
import { AssociateVideoUrlJob } from './AssociateVideoUrlJob';
import { JOBS } from './di';

export * from './AssociateVideoUrlJob';
export * from './types';

const main = async () => {
  const config = getApiConfig();
  const container = JOBS.getContainer();
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
