import { InternalError } from '../errors';
import { MikroORMDb } from './mikro-orm';
import { Db, Orm } from './types';

export const ensureMikroORMDb = (db: Db): db is MikroORMDb => {
  if (db.ormType === Orm.MikroORM) {
    return true;
  }
  throw new InternalError('Db is not MikroORM');
};
