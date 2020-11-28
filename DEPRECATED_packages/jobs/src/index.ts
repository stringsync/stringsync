import { getContainerConfig } from '@stringsync/config';
import { DI, TYPES } from '@stringsync/di';
import { Logger } from '@stringsync/util';
import { AssociateVideoUrlJob } from './AssociateVideoUrlJob';

export * from './AssociateVideoUrlJob';
export * from './types';

const main = async () => {
  const config = getContainerConfig();
  const container = DI.create(config);
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
