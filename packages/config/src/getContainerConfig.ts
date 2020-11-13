import { configFactory } from './configFactory';
import { ConfigKind } from './types';

export const getContainerConfig = configFactory({
  AWS_ACCESS_KEY_ID: ConfigKind.STRING,
  AWS_REGION: ConfigKind.STRING,
  AWS_SECRET_ACCESS_KEY: ConfigKind.STRING,
  CLOUDFRONT_DISTRIBUTION_ID: ConfigKind.STRING,
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
  S3_BUCKET: ConfigKind.STRING,
  S3_VIDEO_SRC_BUCKET: ConfigKind.STRING,
  SESSION_SECRET: ConfigKind.STRING,
  SQS_VIDEO_QUEUE_NAME: ConfigKind.STRING,
  WEB_URI: ConfigKind.STRING,
});

export type ContainerConfig = ReturnType<typeof getContainerConfig>;
