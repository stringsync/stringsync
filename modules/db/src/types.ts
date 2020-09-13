export { Sequelize } from 'sequelize';

export interface Db {
  cleanup(): Promise<void>;
  teardown(): Promise<void>;
}
