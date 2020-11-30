import { DI, TYPES } from '@stringsync/di';
import { Container, ContainerModule } from 'inversify';
import { Cache, RedisCache } from './cache';

export default class implements DI {
  getContainer() {
    const container = new Container();
    return container;
  }

  getContainerModule() {
    return new ContainerModule((bind) => {
      bind<Cache>(TYPES.Cache).to(RedisCache);
    });
  }
}
