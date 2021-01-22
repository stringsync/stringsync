import { APP_GRAPHQL_PORT, APP_SESSION_SECRET, APP_WEB_ORIGIN, configFactory, NODE_ENV } from '@stringsync/config';

export const API_CONFIG = configFactory({
  NODE_ENV: NODE_ENV,
  APP_GRAPHQL_PORT: APP_GRAPHQL_PORT,
  APP_SESSION_SECRET: APP_SESSION_SECRET,
  APP_WEB_ORIGIN: APP_WEB_ORIGIN,
});

export type ApiConfig = ReturnType<typeof API_CONFIG>;
