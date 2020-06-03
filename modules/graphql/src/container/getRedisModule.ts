import { ContainerModule } from 'inversify';
import { GraphqlConfig } from '@stringsync/config';
import IORedis, { Redis } from 'ioredis';
import { TYPES } from '@stringsync/common';

export const getRedisModule = (config: GraphqlConfig) =>
  new ContainerModule((bind) => {
    const redis = new IORedis({
      host: config.REDIS_HOST,
      port: config.REDIS_PORT,
    });
    bind<Redis>(TYPES.Redis).toConstantValue(redis);
  });
