import { getApp } from './app';
import { Container, TYPES } from '@stringsync/container';
import { ContainerConfig } from '@stringsync/config';

export * from './app';

if (require.main === module) {
  const config = Container.instance.get<ContainerConfig>(TYPES.ContainerConfig);
  const app = getApp();

  app.listen(config.PORT, () => {
    console.log(`app running at http://localhost:${config.PORT}`);
  });
}
