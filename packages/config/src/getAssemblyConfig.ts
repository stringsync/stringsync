import { configFactory } from './configFactory';
import { ConfigKind } from './types';

export const getWorkersConfig = configFactory({
  REDIS_HOST: ConfigKind.STRING,
  REDIS_PORT: ConfigKind.INT,
});

export type WorkersConfig = ReturnType<typeof getWorkersConfig>;
