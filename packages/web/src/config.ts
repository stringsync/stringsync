import { configFactory, NODE_ENV, REACT_APP_GRAPHQL_ENDPOINT, REACT_APP_SERVER_URI } from '@stringsync/config/dist';

export const WEB_CONFIG = configFactory({
  NODE_ENV: NODE_ENV,
  REACT_APP_SERVER_URI: REACT_APP_SERVER_URI,
  REACT_APP_GRAPHQL_ENDPOINT: REACT_APP_GRAPHQL_ENDPOINT,
});

export type WebConfig = ReturnType<typeof WEB_CONFIG>;
