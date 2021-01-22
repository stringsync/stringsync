import { ConfigKind, ConfigSpec } from './types';

export const NODE_ENV: ConfigSpec<ConfigKind.STRING, false> = { kind: ConfigKind.STRING, nullable: false };
export const LOG_LEVEL: ConfigSpec<ConfigKind.STRING, false> = { kind: ConfigKind.STRING, nullable: false };

export const APP_GRAPHQL_PORT: ConfigSpec<ConfigKind.INT, false> = { kind: ConfigKind.INT, nullable: false };
export const APP_SESSION_SECRET: ConfigSpec<ConfigKind.STRING, false> = { kind: ConfigKind.STRING, nullable: false };
export const APP_WEB_ORIGIN: ConfigSpec<ConfigKind.STRING, false> = { kind: ConfigKind.STRING, nullable: false };

// The SDK automatically detects AWS credentials set as env variables and uses them for SDK requests
// https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-environment.html
// https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-region.html#setting-region-environment-variable
export const AWS_ACCESS_KEY_ID: ConfigSpec<ConfigKind.STRING, true> = { kind: ConfigKind.STRING, nullable: true };
export const AWS_REGION: ConfigSpec<ConfigKind.STRING, true> = { kind: ConfigKind.STRING, nullable: true };
export const AWS_SECRET_ACCESS_KEY: ConfigSpec<ConfigKind.STRING, true> = { kind: ConfigKind.STRING, nullable: true };
export const CDN_DOMAIN_NAME: ConfigSpec<ConfigKind.STRING, false> = { kind: ConfigKind.STRING, nullable: false };
export const S3_BUCKET: ConfigSpec<ConfigKind.STRING, false> = { kind: ConfigKind.STRING, nullable: false };
export const S3_VIDEO_SRC_BUCKET: ConfigSpec<ConfigKind.STRING, false> = { kind: ConfigKind.STRING, nullable: false };
export const SQS_VIDEO_QUEUE_URL: ConfigSpec<ConfigKind.STRING, false> = { kind: ConfigKind.STRING, nullable: false };
export const DEV_FROM_EMAIL: ConfigSpec<ConfigKind.STRING, true> = { kind: ConfigKind.STRING, nullable: true };
export const DEV_TO_EMAIL: ConfigSpec<ConfigKind.STRING, true> = { kind: ConfigKind.STRING, nullable: true };

export const DB_HOST: ConfigSpec<ConfigKind.STRING, false> = { kind: ConfigKind.STRING, nullable: false };
export const DB_NAME: ConfigSpec<ConfigKind.STRING, false> = { kind: ConfigKind.STRING, nullable: false };
export const DB_PASSWORD: ConfigSpec<ConfigKind.STRING, false> = { kind: ConfigKind.STRING, nullable: false };
export const DB_PORT: ConfigSpec<ConfigKind.INT, false> = { kind: ConfigKind.INT, nullable: false };
export const DB_USERNAME: ConfigSpec<ConfigKind.STRING, false> = { kind: ConfigKind.STRING, nullable: false };

export const REDIS_HOST: ConfigSpec<ConfigKind.STRING, false> = { kind: ConfigKind.STRING, nullable: false };
export const REDIS_PORT: ConfigSpec<ConfigKind.INT, false> = { kind: ConfigKind.INT, nullable: false };

export const REACT_APP_SERVER_URI: ConfigSpec<ConfigKind.STRING, false> = { kind: ConfigKind.STRING, nullable: false };
export const REACT_APP_GRAPHQL_ENDPOINT: ConfigSpec<ConfigKind.STRING, false> = {
  kind: ConfigKind.STRING,
  nullable: false,
};
