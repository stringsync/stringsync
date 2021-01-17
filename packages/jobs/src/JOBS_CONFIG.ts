import { configFactory, NODE_ENV, REDIS_HOST, REDIS_PORT } from '@stringsync/config';

export const JOBS_CONFIG = configFactory({
  NODE_ENV: NODE_ENV,
  REDIS_HOST: REDIS_HOST,
  REDIS_PORT: REDIS_PORT,
});

export type JobsConfig = ReturnType<typeof JOBS_CONFIG>;
