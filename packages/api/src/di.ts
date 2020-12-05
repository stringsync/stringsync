import { DI } from '@stringsync/di';
import { Container, ContainerModule } from 'inversify';

export const API: DI = {
  getContainer: () => {
    return new Container();
  },
  getContainerModule: () => {
    return new ContainerModule((bind) => {
      // noop
    });
  },
};
