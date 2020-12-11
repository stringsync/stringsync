import { Logger, UTIL_TYPES } from '@stringsync/util';
import { createApiContainer } from './API';
import { ApiConfig } from './API_CONFIG';
import { API_TYPES } from './API_TYPES';
import { app } from './app';
import { generateSchema } from './schema';

export * from './API';
export * from './API_CONFIG';
export * from './API_TYPES';
export * from './app';
export * from './schema';

const TYPES = { ...API_TYPES, ...UTIL_TYPES };

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
