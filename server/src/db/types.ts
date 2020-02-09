import { Sequelize } from 'sequelize';
import { StaticModelMap } from './models';

export type Db = Sequelize & {
  models: StaticModelMap;
};

export type DbLogger = (sql: string, timing?: number) => void;
