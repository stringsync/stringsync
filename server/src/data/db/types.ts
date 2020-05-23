import { Sequelize, Transaction } from 'sequelize';
import { StaticModels } from './models';
import { Namespace } from 'cls-hooked';

export type Task<T> = (transaction: Transaction) => PromiseLike<T>;

export type TransactionWrapper = <T>(task: Task<T>) => Promise<T>;

export type Db = {
  sequelize: Sequelize;
  Sequelize: typeof Sequelize;
  transaction: TransactionWrapper;
  namespace: Namespace;
} & {
  [M in keyof StaticModels]: StaticModels[M];
};
