import { Config, getConfig } from '../config';
import { Container } from 'inversify';
import { TYPES } from '@stringsync/common';
import { getReposModule } from './getReposModule';
import { getServicesModule } from './getServicesModule';
import { getGraphqlModule } from './getGraphqlModule';
import { getRedisModule } from './getRedisModule';

const DEFAULT_CONFIG = getConfig(process.env);

export const getContainer = (config = DEFAULT_CONFIG) => {
  const container = new Container();

  container.bind<Config>(TYPES.Config).toConstantValue(config);

  const reposModule = getReposModule(config);
  const servicesModule = getServicesModule(config);
  const graphqlModule = getGraphqlModule();
  const redisModule = getRedisModule(config);

  container.load(reposModule, servicesModule, graphqlModule, redisModule);

  return container;
};
