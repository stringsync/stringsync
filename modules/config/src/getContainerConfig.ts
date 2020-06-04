import { configFactory } from './configFactory';
import { ConfigKind } from './types';

export const getContainerConfig = configFactory({
  NODE_ENV: ConfigKind.STRING,
  PORT: ConfigKind.INT,
  WEB_URI: ConfigKind.STRING,
  DB_NAME: ConfigKind.STRING,
  DB_USERNAME: ConfigKind.STRING,
  DB_PASSWORD: ConfigKind.STRING,
  DB_HOST: ConfigKind.STRING,
  DB_PORT: ConfigKind.INT,
  REDIS_HOST: ConfigKind.STRING,
  REDIS_PORT: ConfigKind.INT,
  SESSION_SECRET: ConfigKind.STRING,
});

export type ContainerConfig = ReturnType<typeof getContainerConfig>;
