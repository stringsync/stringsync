import { DbConfig } from './types';
import { Sequelize } from 'sequelize-typescript';
import { UserModel, NotationModel, TagModel, TaggingModel } from '../models';

export class Db {
  static connect(config: DbConfig): Sequelize {
    const sequelize = new Sequelize({
      dialect: 'postgres',
      host: config.host,
      port: config.port,
      database: config.database,
      username: config.username,
      password: config.password,
      models: [UserModel, NotationModel, TagModel, TaggingModel],
      logging: config.logging,
    });

    // Postgres will return strings for decimals
    // https://github.com/sequelize/sequelize/issues/8019
    (Sequelize as any).postgres.DECIMAL.parse = parseFloat;

    return sequelize;
  }

  static async cleanup(sequelize: Sequelize) {
    const env = process.env.NODE_ENV;
    if (env !== 'development' && env !== 'test') {
      throw new Error(`can only cleanup in development and test environemnts, got: ${env}`);
    }
    await sequelize.query(`
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

  static async teardown(sequelize: Sequelize) {
    sequelize.close();
  }
}
