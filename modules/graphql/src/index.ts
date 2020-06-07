import { app } from './app';
import { getContainerConfig } from '@stringsync/config';
import { createContainer } from '@stringsync/container';

export * from './schema';
export * from './app';

const main = async () => {
  const config = getContainerConfig();
  const container = await createContainer(config);

  app(container).listen(config.PORT, () => {
    console.log(`app running at http://localhost:${config.PORT}`);
  });
};

if (require.main === module) {
  main();
}
