import { createContainer } from '@stringsync/di';
import { Logger, UTIL_TYPES } from '@stringsync/util';
import { API } from './API';
import { ApiConfig } from './API_CONFIG';
import { API_TYPES } from './API_TYPES';
import { app } from './app';
import { generateSchema } from './schema';
import { onExit } from './util';

export * from './API';
export * from './API_CONFIG';
export * from './API_TYPES';
export * from './app';
export * from './schema';

const TYPES = { ...API_TYPES, ...UTIL_TYPES };

const MAX_TEARDOWN_WAIT_MS = 10000;

const main = async () => {
  const { container, teardown } = await createContainer(API);
  const config = container.get<ApiConfig>(TYPES.ApiConfig);
  const schema = generateSchema();
  const logger = container.get<Logger>(TYPES.Logger);

  onExit(teardown, MAX_TEARDOWN_WAIT_MS);

  app(container, schema).listen(config.APP_GRAPHQL_PORT, () => {
    logger.info(`app running at http://localhost:${config.APP_GRAPHQL_PORT}`);
  });
};

if (require.main === module) {
  main();
}
