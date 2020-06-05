import { Container as InverisfyContainer } from 'inversify';
import { getContainerConfig } from '@stringsync/config';
import { getContainer } from './getContainer';
import { Db } from '@stringsync/sequelize';
import { TYPES } from './constants';
import { Redis } from 'ioredis';

export class Container {
  static cache: InverisfyContainer | undefined;

  static get instance(): InverisfyContainer {
    if (!Container.cache) {
      const config = getContainerConfig();
      Container.cache = getContainer(config);
    }
    return Container.cache;
  }

  static async reset() {
    if (!Container.cache) {
      return;
    }

    Container.cleanup(Container.cache);

    Container.cache = undefined;
  }

  private static async cleanup(container: InverisfyContainer) {
    const redis = container.get<Redis>(TYPES.Redis);
    const db = container.get<Db>(TYPES.Db);

    redis.disconnect();
    await db.sequelize.close();
  }
}
