import { Sequelize } from 'sequelize';

export interface Database {
  sequelize: Sequelize;
  cleanup(): Promise<void>;
  teardown(): Promise<void>;
  checkHealth(): Promise<void>;
}
