import { configFactory } from './configFactory';
import { ConfigKind } from './types';

export const getWebConfig = configFactory({
  NODE_ENV: { kind: ConfigKind.STRING, nullable: false },
  REACT_APP_SERVER_URI: { kind: ConfigKind.STRING, nullable: false },
  REACT_APP_GRAPHQL_ENDPOINT: { kind: ConfigKind.STRING, nullable: false },
});

export type WebConfig = ReturnType<typeof getWebConfig>;
