import {
  APP_WEB_URI,
  configFactory,
  NODE_ENV,
  S3_BUCKET,
  S3_VIDEO_SRC_BUCKET,
  SQS_VIDEO_QUEUE_URL,
} from '@stringsync/config';

export const SERVICES_CONFIG = configFactory({
  NODE_ENV: NODE_ENV,
  APP_WEB_URI: APP_WEB_URI,
  S3_BUCKET: S3_BUCKET,
  S3_VIDEO_SRC_BUCKET: S3_VIDEO_SRC_BUCKET,
  SQS_VIDEO_QUEUE_URL: SQS_VIDEO_QUEUE_URL,
});

export type ServicesConfig = ReturnType<typeof SERVICES_CONFIG>;
