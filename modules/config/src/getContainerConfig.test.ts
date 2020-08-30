import { getContainerConfig } from './getContainerConfig';

it('runs without crashing', () => {
  const env = {
    NODE_ENV: 'test',
    PORT: '3000',
    WEB_URI: 'WEB_URI',
    DB_NAME: 'DB_NAME',
    DB_USERNAME: 'DB_USERNAME',
    DB_PASSWORD: 'DB_PASSWORD',
    DB_HOST: 'DB_HOST',
    DB_PORT: '5432',
    LOG_LEVEL: 'debug',
    REDIS_HOST: 'REDIS_HOST',
    REDIS_PORT: '4000',
    S3_ACCESS_KEY_ID: 'S3_ACCESS_KEY_ID',
    S3_SECRET_ACCESS_KEY: 'S3_SECRET_ACCESS_KEY',
    S3_BUCKET: 'S3_BUCKET',
    SESSION_SECRET: 'SESSION_SECRET',
  };

  expect(() => getContainerConfig(env)).not.toThrow();
});
