import { getContainerConfig } from './getContainerConfig';

it('runs without crashing', () => {
  const env = {
    APP_GRAPHQL_PORT: '3000',
    APP_LOG_LEVEL: 'info',
    APP_SESSION_SECRET: 'APP_SESSION_SECRET',
    APP_WEB_URI: 'http://localhost:8080',
    AWS_ACCESS_KEY_ID: 'AWS_ACCESS_KEY_ID',
    AWS_REGION: 'AWS_REGION',
    AWS_SECRET_ACCESS_KEY: 'AWS_SECRET_ACCESS_KEY',
    CDN_DOMAIN_NAME: 'CDN_DOMAIN_NAME',
    DB_HOST: 'db',
    DB_NAME: 'stringsync',
    DB_PASSWORD: 'stringsync',
    DB_PORT: '5432',
    DB_USERNAME: 'stringsync',
    NODE_ENV: 'test',
    REDIS_HOST: 'redis',
    REDIS_PORT: '6379',
    S3_BUCKET: 'S3_BUCKET',
    S3_VIDEO_SRC_BUCKET: 'S3_VIDEO_SRC_BUCKET',
    SQS_VIDEO_QUEUE_URL: 'SQS_VIDEO_QUEUE_URL',
  };

  expect(() => getContainerConfig(env)).not.toThrow();
});
