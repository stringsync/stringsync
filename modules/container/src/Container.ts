import { Container as InverisfyContainer } from 'inversify';
import { getContainerConfig } from '@stringsync/config';
import { getContainer } from './getContainer';
import { Db } from '@stringsync/sequelize';
import { TYPES } from './constants';
import { Redis } from 'ioredis';

let cache: InverisfyContainer | undefined;

export class Container {
  static get instance(): InverisfyContainer {
    if (!cache) {
      const config = getContainerConfig();
      cache = getContainer(config);
    }
    return cache;
  }

  static async reset() {
    if (!cache) {
      return;
    }

    Container.cleanup(cache);

    cache = undefined;
  }

  private static async cleanup(container: InverisfyContainer) {
    const redis = container.get<Redis>(TYPES.Redis);
    const db = container.get<Db>(TYPES.Db);

    redis.disconnect();
    await db.sequelize.close();
  }
}
