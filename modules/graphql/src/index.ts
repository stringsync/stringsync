import { getApp } from './app';
import { getContainerConfig } from '@stringsync/config';
import { createContainer } from '@stringsync/container';

export * from './app';
export * from './schema';

const main = async () => {
  const config = getContainerConfig();
  const container = await createContainer(config);

  const app = getApp(container);

  app.listen(config.PORT, () => {
    console.log(`app running at http://localhost:${config.PORT}`);
  });
};

if (require.main === module) {
  main();
}
