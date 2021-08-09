import { EntityManager } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Db, MikroORMDb, Orm } from '../../db';
import { InternalError } from '../../errors';

const isMikroORMDb = (db: Db): db is MikroORMDb => db.ormType === Orm.MikroORM;

export const getEntityManager = (db: Db): EntityManager<PostgreSqlDriver> => {
  if (isMikroORMDb(db)) {
    return db.em;
  }
  throw new InternalError(`Db is not MikroORMDb (${Orm.MikroORM}), got type: ${db.ormType}`);
};
