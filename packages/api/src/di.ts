import { DI } from '@stringsync/di';
import { Container, ContainerModule } from 'inversify';

export default class implements DI {
  getContainer() {
    const container = new Container();
    return container;
  }

  getContainerModule() {
    return new ContainerModule((bind) => {
      // noop
    });
  }
}
