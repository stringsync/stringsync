import { ContainerConfig, getContainerConfig } from '@stringsync/config';
import { Container } from 'inversify';
import { TYPES } from './constants';
import { getReposModule } from './getReposModule';
import { getServicesModule } from './getServicesModule';
import { getGraphqlModule } from './getGraphqlModule';
import { getRedisModule } from './getRedisModule';
import { getSequelizeModule } from './getSequelizeModule';

export const getContainer = (config: ContainerConfig) => {
  const container = new Container();

  container.bind<ContainerConfig>(TYPES.ContainerConfig).toConstantValue(config);

  const reposModule = getReposModule(config);
  const servicesModule = getServicesModule(config);
  const graphqlModule = getGraphqlModule(config);
  const redisModule = getRedisModule(config);
  const sequelizeModule = getSequelizeModule(config);

  container.load(reposModule, servicesModule, graphqlModule, redisModule, sequelizeModule);

  return container;
};
