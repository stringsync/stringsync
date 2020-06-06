import { Container } from 'inversify';
import { TYPES } from './constants';
import { ContainerConfig } from '@stringsync/config';
import { getTypeormModule } from './getTypeormModule';

export const getContainer = async (config: ContainerConfig) => {
  const container = new Container();

  container.bind<ContainerConfig>(TYPES.ContainerConfig).toConstantValue(config);

  const typeormModule = getTypeormModule(config);

  await container.loadAsync(typeormModule);

  return container;
};
