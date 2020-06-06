import { getApp } from './app';
import { getContainerConfig } from '@stringsync/config';

export * from './app';
export * from './schema';

if (require.main === module) {
  const config = getContainerConfig();
  const app = getApp();

  app.listen(config.PORT, () => {
    console.log(`app running at http://localhost:${config.PORT}`);
  });
}
