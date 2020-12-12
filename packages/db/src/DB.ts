import { Pkg } from '@stringsync/di';
import { Logger, UTIL, UTIL_TYPES } from '@stringsync/util';
import { DbConfig, DB_CONFIG } from './DB_CONFIG';
import { DB_TYPES } from './DB_TYPES';
import { SequelizeDb } from './sequelize';
import { Database } from './types';

const TYPES = { ...DB_TYPES, ...UTIL_TYPES };

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
  cleanup: async (container) => {
    const db = container.get<Database>(TYPES.Database);
    await db.cleanup();
  },
  teardown: async (container) => {
    const logger = container.get<Logger>(TYPES.Logger);
    logger.info('tearing down db connection');
    const db = container.get<Database>(TYPES.Database);
    await db.teardown();
  },
};
