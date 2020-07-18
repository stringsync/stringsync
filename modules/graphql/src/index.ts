import { app } from './app';
import { getContainerConfig } from '@stringsync/config';
import { DI, Logger, TYPES } from '@stringsync/container';
import { generateSchema } from './schema';

export * from './schema';
export * from './app';

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
