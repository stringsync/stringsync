import { app } from './app';
import { getContainerConfig } from '@stringsync/config';
import { Ioc } from '@stringsync/container';

export * from './schema';
export * from './app';

const main = () => {
  const config = getContainerConfig();
  const container = Ioc.create(config);

  app(container).listen(config.PORT, () => {
    console.log(`app running at http://localhost:${config.PORT}`);
  });
};

if (require.main === module) {
  main();
}
