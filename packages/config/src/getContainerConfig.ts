import { configFactory } from './configFactory';
import { ConfigKind } from './types';

export const getContainerConfig = configFactory({
  APP_GRAPHQL_PORT: ConfigKind.INT,
  APP_LOG_LEVEL: ConfigKind.STRING,
  APP_SESSION_SECRET: ConfigKind.STRING,
  APP_WEB_URI: ConfigKind.STRING,
  AWS_ACCESS_KEY_ID: ConfigKind.STRING,
  AWS_REGION: ConfigKind.STRING,
  AWS_SECRET_ACCESS_KEY: ConfigKind.STRING,
  CDN_DOMAIN_NAME: ConfigKind.STRING,
  DB_HOST: ConfigKind.STRING,
  DB_NAME: ConfigKind.STRING,
  DB_PASSWORD: ConfigKind.STRING,
  DB_PORT: ConfigKind.INT,
  DB_USERNAME: ConfigKind.STRING,
  NODE_ENV: ConfigKind.STRING,
  REDIS_HOST: ConfigKind.STRING,
  REDIS_PORT: ConfigKind.INT,
  S3_BUCKET: ConfigKind.STRING,
  S3_VIDEO_SRC_BUCKET: ConfigKind.STRING,
  SQS_VIDEO_QUEUE_NAME: ConfigKind.STRING,
});

export type ContainerConfig = ReturnType<typeof getContainerConfig>;
