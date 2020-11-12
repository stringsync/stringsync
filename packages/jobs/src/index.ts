import { getContainerConfig } from '@stringsync/config';
import { DI, TYPES } from '@stringsync/di';
import { UpdateVideoUrlWorker } from './UpdateVideoUrlWorker';

export * from './types';
export * from './UpdateVideoUrlQueue';
export * from './UpdateVideoUrlWorker';

const main = async () => {
  const config = getContainerConfig();
  const container = DI.create(config);

  const updateVideoUrlWorker = container.get<UpdateVideoUrlWorker>(TYPES.UpdateVideoUrlWorker);
  updateVideoUrlWorker.start();
};

if (require.main === module) {
  main();
}
