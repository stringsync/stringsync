import { interfaces } from 'inversify';

export interface DI {
  getContainer(): interfaces.Container;
  getContainerModule(): interfaces.ContainerModule;
}
