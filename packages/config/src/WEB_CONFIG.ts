import { configFactory } from './configFactory';
import { ConfigKind } from './types';

export const WEB_CONFIG = configFactory({
  NODE_ENV: { kind: ConfigKind.STRING, nullable: false },
  REACT_APP_SERVER_URI: { kind: ConfigKind.STRING, nullable: false },
  REACT_APP_GRAPHQL_ENDPOINT: { kind: ConfigKind.STRING, nullable: false },
});

export type WebConfig = ReturnType<typeof WEB_CONFIG>;
