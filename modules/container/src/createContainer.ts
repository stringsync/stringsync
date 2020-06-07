import { Container } from 'inversify';
import { TYPES } from './constants';
import { ContainerConfig, getContainerConfig } from '@stringsync/config';
import { getTypeormModule } from './getTypeormModule';
import { getRedisModule } from './getRedisModule';
import { getReposModule } from './getReposModule';
import { getServicesModule } from './getServicesModule';
import { getGraphqlModule } from './getGraphqlModule';

const DEFAULT_CONFIG = getContainerConfig(process.env);

export const createContainer = async (config: ContainerConfig = DEFAULT_CONFIG) => {
  const container = new Container();

  container.bind<ContainerConfig>(TYPES.ContainerConfig).toConstantValue(config);

  const typeormModule = await getTypeormModule(config);

  await container.loadAsync(typeormModule);

  const redisModule = getRedisModule(config);
  const servicesModule = getServicesModule(config);
  const reposModule = getReposModule(config);
  const graphqlModule = getGraphqlModule(config);

  container.load(redisModule, servicesModule, reposModule, graphqlModule);

  return container;
};
