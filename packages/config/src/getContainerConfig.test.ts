import { getContainerConfig } from './getContainerConfig';

it('runs without crashing', () => {
  const env = {
    AWS_ACCESS_KEY_ID: 'AWS_ACCESS_KEY_ID',
    AWS_SECRET_ACCESS_KEY: 'AWS_SECRET_ACCESS_KEY',
    AWS_REGION: 'AWS_REGION',
    CLOUDFRONT_DOMAIN_NAME: 'CLOUDFRONT_DOMAIN_NAME',
    DB_HOST: 'DB_HOST',
    DB_NAME: 'DB_NAME',
    DB_PASSWORD: 'DB_PASSWORD',
    DB_PORT: '5432',
    DB_USERNAME: 'DB_USERNAME',
    LOG_LEVEL: 'debug',
    NODE_ENV: 'test',
    PORT: '3000',
    REDIS_HOST: 'REDIS_HOST',
    REDIS_PORT: '4000',
    S3_BUCKET: 'S3_BUCKET',
    S3_VIDEO_SRC_BUCKET: 'S3_VIDEO_SRC_BUCKET',
    SESSION_SECRET: 'SESSION_SECRET',
    WEB_URI: 'WEB_URI',
    VIDEO_MESSAGE_QUEUE_NAME: 'VIDEO_MESSAGE_QUEUE_NAME',
  };

  expect(() => getContainerConfig(env)).not.toThrow();
});
