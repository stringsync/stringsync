import { Sequelize } from 'sequelize';
import { StaticModels } from './models';
import { Namespace } from 'cls-hooked';

export type Db = {
  sequelize: Sequelize;
  Sequelize: typeof Sequelize;
  namespace: Namespace;
} & {
  [M in keyof StaticModels]: StaticModels[M];
};
