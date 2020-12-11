import { configFactory, DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USERNAME, NODE_ENV } from '@stringsync/config';

export const DB_CONFIG = configFactory({
  NODE_ENV: NODE_ENV,
  DB_HOST: DB_HOST,
  DB_NAME: DB_NAME,
  DB_PASSWORD: DB_PASSWORD,
  DB_PORT: DB_PORT,
  DB_USERNAME: DB_USERNAME,
});

export type DbConfig = ReturnType<typeof DB_CONFIG>;
