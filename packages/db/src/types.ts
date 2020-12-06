import { Sequelize } from 'sequelize';

export interface Db {
  sequelize: Sequelize;
  cleanup(): Promise<void>;
  teardown(): Promise<void>;
}
