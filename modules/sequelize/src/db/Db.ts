import { Transaction, Sequelize } from 'sequelize/types';
import { StaticModels } from './StaticModel';

export type Task<T> = (transaction: Transaction) => PromiseLike<T>;

export type TransactionWrapper = <T>(task: Task<T>) => PromiseLike<T>;

export type Db = {
  sequelize: Sequelize;
  Sequelize: typeof Sequelize;
  transaction: TransactionWrapper;
} & {
  [M in keyof StaticModels]: StaticModels[M];
};
