import { configFactory } from './configFactory';
import { ConfigKind } from './types';

export const getJobConfig = configFactory({
  REDIS_HOST: ConfigKind.STRING,
  REDIS_PORT: ConfigKind.INT,
});

export type JobConfig = ReturnType<typeof getJobConfig>;
