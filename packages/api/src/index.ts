import { TYPES } from '@stringsync/di';
import { Logger } from '@stringsync/util';
import { ApiConfig, createApiContainer } from './API';
import { app } from './app';
import { generateSchema } from './schema';

export * from './app';
export * from './schema';

const main = async () => {
  const container = await createApiContainer();
  const schema = generateSchema();
  const config = container.get<ApiConfig>(TYPES.ApiConfig);
  const logger = container.get<Logger>(TYPES.Logger);

  app(container, schema).listen(config.APP_GRAPHQL_PORT, () => {
    logger.info(`app running at http://localhost:${config.APP_GRAPHQL_PORT}`);
  });
};

if (require.main === module) {
  main();
}
