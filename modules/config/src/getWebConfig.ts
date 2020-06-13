import { configFactory } from './configFactory';
import { ConfigKind } from './types';

export const getWebConfig = configFactory({
  NODE_ENV: ConfigKind.STRING,
  REACT_APP_SERVER_URI: ConfigKind.STRING,
});

export type WebConfig = ReturnType<typeof getWebConfig>;
