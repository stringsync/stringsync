import { ContainerModule } from 'inversify';
import { ContainerConfig } from '@stringsync/config';
import { RedisClient as Redis, createClient } from 'redis';
import { TYPES } from '@stringsync/container';

export const getRedisModule = (config: ContainerConfig) =>
  new ContainerModule((bind) => {
    const redis = createClient({
      host: config.REDIS_HOST,
      port: config.REDIS_PORT,
    });
    bind<Redis>(TYPES.Redis).toConstantValue(redis);
  });
