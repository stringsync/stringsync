import { Sequelize } from 'sequelize';
import { StaticModelMap } from './models';

export type Db = Sequelize & {
  models: StaticModelMap;
};
