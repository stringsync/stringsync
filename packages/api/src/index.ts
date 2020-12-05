import { getApiConfig } from '@stringsync/config';
import { TYPES } from '@stringsync/di';
import { Logger } from '@stringsync/util';
import { app } from './app';
import { API } from './di';
import { generateSchema } from './schema';

export * from './app';
export * from './schema';

const main = () => {
  const config = getApiConfig();
  const container = API.getContainer();
  const schema = generateSchema();
  const logger = container.get<Logger>(TYPES.Logger);

  app(container, schema).listen(config.APP_GRAPHQL_PORT, () => {
    logger.info(`app running at http://localhost:${config.APP_GRAPHQL_PORT}`);
  });
};

if (require.main === module) {
  main();
}
