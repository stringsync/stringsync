import { Db } from '../types';
import { SequelizeDbConfig } from './types';
import { Sequelize } from 'sequelize-typescript';
import { TaggingModel, UserModel, NotationModel, TagModel } from './models';

export class SequelizeDb implements Db {
  static create(config: SequelizeDbConfig) {
    // Postgres will return strings for decimals
    // https://github.com/sequelize/sequelize/issues/8019
    (Sequelize as any).postgres.DECIMAL.parse = parseFloat;

    // https://github.com/RobinBuschmann/sequelize-typescript/issues/336#issuecomment-375527175

    const sequelize = new Sequelize({
      dialect: 'postgres',
      host: config.host,
      port: config.port,
      database: config.database,
      username: config.username,
      password: config.password,
      models: [NotationModel, TaggingModel, TagModel, UserModel],
      logging: config.logging,
    });

    return new SequelizeDb(sequelize);
  }

  sequelize: Sequelize;

  constructor(sequelize: Sequelize) {
    this.sequelize = sequelize;
  }

  async transaction<T extends any>(task: () => Promise<T>) {
    return await this.sequelize.transaction<T>(task);
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
