import { Container as InverisfyContainer } from 'inversify';
import { getContainer } from './getContainer';
import { getContainerConfig } from '@stringsync/config';

let cache: InverisfyContainer;

export class Container {
  static get instance(): InverisfyContainer {
    if (!cache) {
      const config = getContainerConfig();
      cache = getContainer(config);
    }
    return cache;
  }
}
