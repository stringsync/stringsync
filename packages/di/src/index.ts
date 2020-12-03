import { interfaces } from 'inversify';
import 'reflect-metadata';

export abstract class DI {
  abstract getContainer(): interfaces.Container;
  abstract getContainerModule(): interfaces.ContainerModule;
}

export const TYPES = Object.freeze({
  BlobStorage: Symbol('BlobStorage'),
  Cache: Symbol('Cache'),
  Logger: Symbol('Logger'),
  Mailer: Symbol('Mailer'),
  MessageQueue: Symbol('MessageQueue'),
});
