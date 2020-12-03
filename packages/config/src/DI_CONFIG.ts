import { ConfigKind } from '.';
import { configFactory } from './configFactory';

export const DI_CONFIG = configFactory({
  APP_GRAPHQL_PORT: { kind: ConfigKind.INT, nullable: false },
  APP_LOG_LEVEL: { kind: ConfigKind.STRING, nullable: false },
  APP_SESSION_SECRET: { kind: ConfigKind.STRING, nullable: false },
  APP_WEB_URI: { kind: ConfigKind.STRING, nullable: false },
  // The SDK automatically detects AWS credentials set as env variables and uses them for SDK requests
  // https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-environment.html
  // https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-region.html#setting-region-environment-variable
  AWS_ACCESS_KEY_ID: { kind: ConfigKind.STRING, nullable: true },
  AWS_REGION: { kind: ConfigKind.STRING, nullable: true },
  AWS_SECRET_ACCESS_KEY: { kind: ConfigKind.STRING, nullable: true },
  CDN_DOMAIN_NAME: { kind: ConfigKind.STRING, nullable: false },
  DB_HOST: { kind: ConfigKind.STRING, nullable: false },
  DB_NAME: { kind: ConfigKind.STRING, nullable: false },
  DB_PASSWORD: { kind: ConfigKind.STRING, nullable: false },
  DB_PORT: { kind: ConfigKind.INT, nullable: false },
  DB_USERNAME: { kind: ConfigKind.STRING, nullable: false },
  NODE_ENV: { kind: ConfigKind.STRING, nullable: false },
  REDIS_HOST: { kind: ConfigKind.STRING, nullable: false },
  REDIS_PORT: { kind: ConfigKind.INT, nullable: false },
  S3_BUCKET: { kind: ConfigKind.STRING, nullable: false },
  S3_VIDEO_SRC_BUCKET: { kind: ConfigKind.STRING, nullable: false },
  SQS_VIDEO_QUEUE_URL: { kind: ConfigKind.STRING, nullable: false },
});
