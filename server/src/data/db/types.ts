import { Sequelize } from 'sequelize';
import { StaticModels } from './models';

export type Db = {
  sequelize: Sequelize;
} & {
  [M in keyof StaticModels]: StaticModels[M];
};
