import { Env } from './Env';

const NODE_ENV = Env.string('NODE_ENV').get();
const LOG_LEVEL = Env.string('LOG_LEVEL').get();
const PORT = Env.number('PORT').get();

// Used for generation session secrets in the express-session library.
const SESSION_SECRET = Env.string('SESSION_SECRET').get();

// The SDK automatically detects AWS credentials set as env variables and uses them for SDK requests
// https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-environment.html
// https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-region.html#setting-region-environment-variable
Env.string('AWS_ACCESS_KEY_ID').getOrDefault('');
Env.string('AWS_REGION').getOrDefault('');
Env.string('AWS_SECRET_ACCESS_KEY').getOrDefault('');

const WEB_UI_CDN_DOMAIN_NAME = Env.string('WEB_UI_CDN_DOMAIN_NAME').get();

const MEDIA_CDN_DOMAIN_NAME = Env.string('MEDIA_CDN_DOMAIN_NAME').get();
const MEDIA_S3_BUCKET = Env.string('MEDIA_S3_BUCKET').get();

const VIDEO_SRC_S3_BUCKET = Env.string('VIDEO_SRC_S3_BUCKET').get();
const VIDEO_QUEUE_SQS_URL = Env.string('VIDEO_QUEUE_SQS_URL').get();

const INFO_EMAIL = Env.string('INFO_EMAIL').get();
const DEV_EMAIL = Env.string('DEV_EMAIL').get();

const DB_HOST = Env.string('DB_HOST').get();
const DB_NAME = Env.string('DB_NAME').get();
const DB_PORT = Env.number('DB_PORT').get();
const DB_USERNAME = Env.string('DB_USERNAME').get();
const DB_PASSWORD = Env.string('DB_PASSWORD').get();

const REDIS_HOST = Env.string('REDIS_HOST').get();
const REDIS_PORT = Env.number('REDIS_PORT').get();

export const config = {
  NODE_ENV,
  LOG_LEVEL,
  PORT,
  SESSION_SECRET,
  WEB_UI_CDN_DOMAIN_NAME,
  MEDIA_CDN_DOMAIN_NAME,
  MEDIA_S3_BUCKET,
  VIDEO_SRC_S3_BUCKET,
  VIDEO_QUEUE_SQS_URL,
  INFO_EMAIL,
  DEV_EMAIL,
  DB_HOST,
  DB_NAME,
  DB_PORT,
  DB_USERNAME,
  DB_PASSWORD,
  REDIS_HOST,
  REDIS_PORT,
} as const;

export type Config = typeof config;
