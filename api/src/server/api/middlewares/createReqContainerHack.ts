import { Container } from 'inversify';
import { RedisClient } from 'redis';
import { Db } from '../../../db';
import { Db as MikroORMDb } from '../../../db/mikro-orm';
import { TYPES } from '../../../inversify.constants';

/**
 * Creating a child does not copy its underlying binding dictionary, which is a map that resolves
 * service identifiers. This hack creates a new container without having to create new DB connections,
 * redis connections, etc. without having to clean them up. This allows us to rebind dependencies
 * such that they are request scoped.
 *
 * https://github.com/inversify/InversifyJS/issues/1076
 */
export const createReqContainerHack = (container: Container): Container => {
  // copy the container
  const reqContainer = Container.merge(container, new Container()) as Container;

  // rebind singletons into constants
  const db = container.get<MikroORMDb>(TYPES.Db);
  reqContainer.rebind<Db>(TYPES.Db).toConstantValue(db);

  const redis = container.get<RedisClient>(TYPES.Redis);
  reqContainer.rebind<RedisClient>(TYPES.Redis).toConstantValue(redis);

  return reqContainer;
};
