import { Container } from 'inversify';
import { TYPES } from './constants';
import { ContainerConfig } from '@stringsync/config';

export const getContainer = (config: ContainerConfig) => {
  const container = new Container();

  container.bind<ContainerConfig>(TYPES.ContainerConfig).toConstantValue(config);

  return container;
};
