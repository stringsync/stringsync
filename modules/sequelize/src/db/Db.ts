import { DbConfig } from './types';
import { Sequelize } from 'sequelize-typescript';
import { models } from '../models';

export class Db {
  static connect(config: DbConfig): Sequelize {
    return new Sequelize({
      dialect: 'postgres',
      host: config.host,
      port: config.port,
      database: config.database,
      username: config.username,
      password: config.password,
      models: models,
      logging: config.logging,
    });
  }

  static async cleanup(sequelize: Sequelize) {
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
