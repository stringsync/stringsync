import { getSequelizeModule } from './getSequelizeModule';
import { Container } from 'inversify';
import { TYPES } from './constants';
import { ContainerConfig, getContainerConfig } from '@stringsync/config';
import { getRedisModule } from './getRedisModule';
import { getReposModule } from './getReposModule';
import { getServicesModule } from './getServicesModule';
import { getGraphqlModule } from './getGraphqlModule';

export const createContainer = async (config: ContainerConfig = getContainerConfig()) => {
  const container = new Container();

  container.bind<ContainerConfig>(TYPES.ContainerConfig).toConstantValue(config);

  const redisModule = getRedisModule(config);
  const servicesModule = getServicesModule(config);
  const reposModule = getReposModule(config);
  const graphqlModule = getGraphqlModule(config);
  const sequelizeModule = getSequelizeModule(config);

  container.load(redisModule, servicesModule, reposModule, graphqlModule, sequelizeModule);

  return container;
};
