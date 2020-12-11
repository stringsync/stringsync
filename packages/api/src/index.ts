import { Logger, UTIL } from '@stringsync/util';
import { API, ApiConfig, createApiContainer } from './API';
import { app } from './app';
import { generateSchema } from './schema';

export * from './app';
export * from './schema';

const TYPES = { ...API.TYPES, ...UTIL.TYPES };

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
