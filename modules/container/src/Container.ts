import { Container as InverisfyContainer } from 'inversify';
import { getContainerConfig } from '@stringsync/config';
import { getContainer } from './getContainer';
import { Connection } from 'typeorm';
import { TYPES } from './constants';

export class Container {
  static cache: InverisfyContainer | undefined;

  static async instance(): Promise<InverisfyContainer> {
    if (!Container.cache) {
      const config = getContainerConfig();
      Container.cache = await getContainer(config);
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
    // const redis = container.get<Redis>(TYPES.Redis);
    // redis.disconnect();
    const connection = container.get<Connection>(TYPES.Connection);
    await connection.close();
  }
}
