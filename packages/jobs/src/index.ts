import { getContainerConfig } from '@stringsync/config';
import { DI, TYPES } from '@stringsync/di';
import { Logger } from '@stringsync/util';
import { UpdateVideoUrlJob } from './UpdateVideoUrlJob';

export * from './types';

const main = async () => {
  const config = getContainerConfig();
  const container = DI.create(config);
  const logger = container.get<Logger>(TYPES.Logger);

  // get jobs
  const updateVideoUrlJob = container.get<UpdateVideoUrlJob>(TYPES.UpdateVideoUrlJob);
  updateVideoUrlJob.setupQueue();
  updateVideoUrlJob.setupWorker();
  await updateVideoUrlJob.enqueue(undefined, {
    repeat: {
      every: 60000, // milliseconds
    },
  });

  logger.info('jobs setup');
};

if (require.main === module) {
  main();
}
