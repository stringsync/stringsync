import { DI } from '@stringsync/di';
import { Container, ContainerModule } from 'inversify';

export default class implements DI {
  getContainer() {
    return new Container();
  }

  getContainerModule() {
    return new ContainerModule((bind) => {
      // noop
    });
  }
}
