import { ContainerModule } from 'inversify';
import { ContainerConfig } from '@stringsync/config';
import { RedisClient } from 'redis';
import { Redis } from './redis';
import { TYPES } from '@stringsync/container';

export const getRedisModule = (config: ContainerConfig) =>
  new ContainerModule((bind) => {
    const redis = Redis.create({
      host: config.REDIS_HOST,
      port: config.REDIS_PORT,
    });
    bind<RedisClient>(TYPES.Redis).toConstantValue(redis);
  });
