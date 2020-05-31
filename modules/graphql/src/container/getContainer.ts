import { Config, getConfig } from '../config';
import { Container } from 'inversify';
import { TYPES } from './TYPES';
import { getReposModule } from './getReposModule';
import IORedis, { Redis } from 'ioredis';
import { getServicesModule } from './getServicesModule';

const DEFAULT_CONFIG = getConfig(process.env);

export const getContainer = (config = DEFAULT_CONFIG) => {
  const container = new Container();

  container.bind<Config>(TYPES.Config).toConstantValue(config);

  const redis = new IORedis({
    host: config.REDIS_HOST,
    port: parseInt(config.REDIS_PORT, 10),
  });
  container.bind<Redis>(TYPES.Redis).toConstantValue(redis);

  const reposModule = getReposModule(config);
  const servicesModule = getServicesModule(config);

  container.load(reposModule, servicesModule);

  return container;
};
