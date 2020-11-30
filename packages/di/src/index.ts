import { interfaces } from 'inversify';
import 'reflect-metadata';

export interface DI {
  getContainer(): interfaces.Container;
  getContainerModule(): interfaces.ContainerModule;
}

export const TYPES = Object.freeze({
  BlobStorage: Symbol('BlobStorage'),
  Cache: Symbol('Cache'),
  Logger: Symbol('Logger'),
  Mailer: Symbol('Mailer'),
  MessageQueue: Symbol('MessageQueue'),
});
