import { configFactory } from './configFactory';
import { ConfigKind } from './types';

export const getContainerConfig = configFactory({
  DB_HOST: ConfigKind.STRING,
  DB_NAME: ConfigKind.STRING,
  DB_PASSWORD: ConfigKind.STRING,
  DB_PORT: ConfigKind.INT,
  DB_USERNAME: ConfigKind.STRING,
  LOG_LEVEL: ConfigKind.STRING,
  NODE_ENV: ConfigKind.STRING,
  PORT: ConfigKind.INT,
  REDIS_HOST: ConfigKind.STRING,
  REDIS_PORT: ConfigKind.INT,
  S3_ACCESS_KEY_ID: ConfigKind.STRING,
  S3_SECRET_ACCESS_KEY: ConfigKind.STRING,
  SESSION_SECRET: ConfigKind.STRING,
  WEB_URI: ConfigKind.STRING,
});

export type ContainerConfig = ReturnType<typeof getContainerConfig>;
