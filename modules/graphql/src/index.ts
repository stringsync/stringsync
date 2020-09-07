import { getContainerConfig } from '@stringsync/config';
import { DI, TYPES } from '@stringsync/container';
import { Logger } from '@stringsync/util';
import { app } from './app';
import { generateSchema } from './schema';

export * from './app';
export * from './schema';

const main = () => {
  const config = getContainerConfig();
  const container = DI.create(config);
  const schema = generateSchema();
  const logger = container.get<Logger>(TYPES.Logger);

  app(container, schema).listen(config.PORT, () => {
    logger.info(`app running at http://localhost:${config.PORT}`);
  });
};

if (require.main === module) {
  main();
}
