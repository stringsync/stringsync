import { EntityManager } from '@mikro-orm/core';
import { Db, MikroORMDb, Orm } from '../../db';
import { InternalError } from '../../errors';

const isMikroORMDb = (db: Db): db is MikroORMDb => db.ormType === Orm.MikroORM;

export const em = (db: Db): EntityManager => {
  if (isMikroORMDb(db)) {
    return db.em;
  }
  throw new InternalError(`Db is not MikroORMDb (${Orm.MikroORM}), got type: ${db.ormType}`);
};
