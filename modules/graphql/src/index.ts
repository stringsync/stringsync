import { getContainerConfig } from '@stringsync/config';
import { getApp } from './app';

export * from './app';
export * from './schema';

const config = getContainerConfig();
const app = getApp();

app.listen(config.PORT, () => {
  console.log(`running at http://localhost:${config.PORT}`);
});
