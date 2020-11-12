import { getContainerConfig } from '@stringsync/config';
import { DI } from '@stringsync/di';

export * from './types';
export * from './UpdateVideoUrlQueue';
export * from './UpdateVideoUrlWorker';

const main = async () => {
  const config = getContainerConfig();
  const container = DI.create(config);
};

if (require.main === module) {
  main();
}
