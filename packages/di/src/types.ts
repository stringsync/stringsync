import { interfaces } from 'inversify';

export type DI = {
  getContainer: () => interfaces.Container;
  getContainerModule: () => interfaces.ContainerModule;
};
