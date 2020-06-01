import { ContainerModule } from 'inversify';
import { Config } from '../config';
import IORedis, { Redis } from 'ioredis';
import { TYPES } from '@stringsync/common';

export const getRedisModule = (config: Config) =>
  new ContainerModule((bind) => {
    const redis = new IORedis({
      host: config.REDIS_HOST,
      port: parseInt(config.REDIS_PORT, 10),
    });
    bind<Redis>(TYPES.Redis).toConstantValue(redis);
  });
