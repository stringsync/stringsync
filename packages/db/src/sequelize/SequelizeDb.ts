import { inject, injectable } from '@stringsync/di';
import { Logger, UTIL_TYPES } from '@stringsync/util';
import { createNamespace, getNamespace } from 'cls-hooked';
import { Sequelize } from 'sequelize';
import { DbConfig } from '../DB_CONFIG';
import { DB_TYPES } from '../DB_TYPES';
import { Database } from '../types';
import { NotationModel, TaggingModel, TagModel, UserModel } from './models';

const TYPES = { ...UTIL_TYPES, ...DB_TYPES };

@injectable()
export class SequelizeDb implements Database {
  private static hackClsNamespace() {
    // process.namespaces gets overwritten when importing cls-hooked:
    // https://github.com/Jeff-Lewis/cls-hooked/blob/master/context.js#L453
    // As a workaround, process.stringSyncTransactionNamespace gets set by
    // ApiTestEnvironment.js, and then re-set here.
    const p = process as any;
    p.namespaces.transaction = p.stringSyncTransactionNamespace;
  }

  logger: Logger;
  config: DbConfig;
  sequelize: Sequelize;

  constructor(@inject(TYPES.Logger) logger: Logger, @inject(TYPES.DbConfig) config: DbConfig) {
    if (config.NODE_ENV === 'test') {
      SequelizeDb.hackClsNamespace();
    }

    const namespace = getNamespace('transaction') || createNamespace('transaction');

    Sequelize.useCLS(namespace);

    const sequelize = new Sequelize({
      dialect: 'postgres',
      host: config.DB_HOST,
      port: config.DB_PORT,
      database: config.DB_NAME,
      username: config.DB_USERNAME,
      password: config.DB_PASSWORD,
      logging: (sql: string) => logger.debug(sql),
    });

    TaggingModel.initColumns(sequelize);
    UserModel.initColumns(sequelize);
    NotationModel.initColumns(sequelize);
    TagModel.initColumns(sequelize);

    TaggingModel.initAssociations();
    UserModel.initAssociations();
    NotationModel.initAssociations();
    TagModel.initAssociations();

    this.logger = logger;
    this.config = config;
    this.sequelize = sequelize;
  }

  async cleanup() {
    const env = this.config.NODE_ENV;
    if (env !== 'development' && env !== 'test') {
      throw new Error(`can only cleanup in development and test environemnts, got: ${env}`);
    }
    await this.sequelize.query(`
      DO
      $func$
      BEGIN
        EXECUTE (
          SELECT 'TRUNCATE TABLE ' || string_agg(oid::regclass::text, ', ') || ' CASCADE'
            FROM pg_class
            WHERE relkind = 'r'
            AND relnamespace = 'public'::regnamespace
        );
      END
      $func$;
    `);
  }

  async teardown() {
    await this.sequelize.close();
  }

  async checkHealth() {
    await this.sequelize.authenticate();
  }
}
