import { interfaces } from 'inversify';
import 'reflect-metadata';

export interface DI {
  getContainer(): interfaces.Container;
  getContainerModule(): interfaces.ContainerModule;
}

export const TYPES = Object.freeze({});
