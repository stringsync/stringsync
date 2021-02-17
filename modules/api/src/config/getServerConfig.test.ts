import { getServerConfig } from './getServerConfig';

describe('getServerConfig', () => {
  it('parses an environment', () => {
    const env = {
      NODE_ENV: 'development',
      LOG_LEVEL: 'debug',
      APP_GRAPHQL_PORT: '3000',
      APP_SESSION_SECRET: 'keyboardcat',
      APP_WEB_ORIGIN: 'example.com',
      AWS_ACCESS_KEY_ID: 'AWS_ACCESS_KEY_ID',
      AWS_REGION: 'AWS_REGION',
      AWS_SECRET_ACCESS_KEY: 'AWS_SECRET_ACCESS_KEY',
      CDN_DOMAIN_NAME: 'CDN_DOMAIN_NAME',
      S3_BUCKET: 'S3_BUCKET',
      S3_VIDEO_SRC_BUCKET: 'S3_VIDEO_SRC_BUCKET',
      SQS_VIDEO_QUEUE_URL: 'SQS_VIDEO_QUEUE_URL',
      INFO_EMAIL: 'info@example.com',
      DEV_EMAIL: 'dev@example.com',
      DB_HOST: 'DB_HOST',
      DB_NAME: 'DB_NAME',
      DB_PASSWORD: 'DB_PASSWORD',
      DB_PORT: '5432',
      DB_USERNAME: 'DB_USERNAME',
      REDIS_HOST: 'REDIS_HOST',
      REDIS_PORT: '6379',
    };

    const config = getServerConfig(env);

    expect(config).toStrictEqual({
      NODE_ENV: 'development',
      LOG_LEVEL: 'debug',
      APP_GRAPHQL_PORT: 3000,
      APP_SESSION_SECRET: 'keyboardcat',
      APP_WEB_ORIGIN: 'example.com',
      AWS_ACCESS_KEY_ID: 'AWS_ACCESS_KEY_ID',
      AWS_REGION: 'AWS_REGION',
      AWS_SECRET_ACCESS_KEY: 'AWS_SECRET_ACCESS_KEY',
      CDN_DOMAIN_NAME: 'CDN_DOMAIN_NAME',
      S3_BUCKET: 'S3_BUCKET',
      S3_VIDEO_SRC_BUCKET: 'S3_VIDEO_SRC_BUCKET',
      SQS_VIDEO_QUEUE_URL: 'SQS_VIDEO_QUEUE_URL',
      INFO_EMAIL: 'info@example.com',
      DEV_EMAIL: 'dev@example.com',
      DB_HOST: 'DB_HOST',
      DB_NAME: 'DB_NAME',
      DB_PASSWORD: 'DB_PASSWORD',
      DB_PORT: 5432,
      DB_USERNAME: 'DB_USERNAME',
      REDIS_HOST: 'REDIS_HOST',
      REDIS_PORT: 6379,
    });
  });

  it('throws an error when missing a value', () => {
    const env = {};
    expect(() => getServerConfig(env)).toThrow();
  });
});
