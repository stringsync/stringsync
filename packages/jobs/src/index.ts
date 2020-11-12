import { getContainerConfig } from '@stringsync/config';
import { DI } from '@stringsync/di';

const main = async () => {
  const config = getContainerConfig();
  const container = DI.create(config);
};

if (require.main === module) {
  main();
}
