import { Pkg } from '@stringsync/di';
import { UTIL } from '@stringsync/util';
import { DbConfig, DB_CONFIG } from './DB_CONFIG';
import { DB_TYPES } from './DB_TYPES';
import { SequelizeDb } from './sequelize';
import { Database } from './types';

const TYPES = { ...DB_TYPES };

export const DB: Pkg = {
  name: 'DB',
  deps: [UTIL],
  bindings: async (bind) => {
    const config = DB_CONFIG();
    bind<DbConfig>(TYPES.DbConfig).toConstantValue(config);

    bind<Database>(TYPES.Database)
      .to(SequelizeDb)
      .inSingletonScope();
  },
};
