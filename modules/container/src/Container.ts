import { Container as InverisfyContainer } from 'inversify';
import { getContainerConfig } from '@stringsync/config';
import { getContainer } from './getContainer';

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
