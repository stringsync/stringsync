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
    SESSION_SECRET: 'SESSION_SECRET',
    VIDEO_METADATA_TABLE_NAME: 'VIDEO_METADATA_TABLE_NAME',
    WEB_URI: 'WEB_URI',
  };

  expect(() => getContainerConfig(env)).not.toThrow();
});
