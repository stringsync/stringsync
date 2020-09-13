import { Sequelize } from 'sequelize';
import { Db } from '../types';
import { NotationModel, TaggingModel, TagModel, UserModel } from './models';
import { SequelizeDbConfig } from './types';

export class SequelizeDb implements Db {
  static create(config: SequelizeDbConfig) {
    const sequelize = new Sequelize({
      dialect: 'postgres',
      host: config.host,
      port: config.port,
      database: config.database,
      username: config.username,
      password: config.password,
      logging: config.logging,
    });

    TaggingModel.initColumns(sequelize);
    UserModel.initColumns(sequelize);
    NotationModel.initColumns(sequelize);
    TagModel.initColumns(sequelize);

    TaggingModel.initAssociations();
    UserModel.initAssociations();
    NotationModel.initAssociations();
    TagModel.initAssociations();

    return new SequelizeDb(sequelize);
  }

  sequelize: Sequelize;

  constructor(sequelize: Sequelize) {
    this.sequelize = sequelize;
  }

  async cleanup() {
    const env = process.env.NODE_ENV;
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
}
