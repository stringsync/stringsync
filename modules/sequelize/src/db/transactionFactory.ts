import { Sequelize, Transaction } from 'sequelize';
import { Task } from './types';
import { TRANSACTION_NAMESPACE, TRANSACTION_NAMESPACE_NAME } from './constants';

export const transactionFactory = (sequelize: Sequelize) => async <T>(task: Task<T>): Promise<T> => {
  const transaction: Transaction | undefined = TRANSACTION_NAMESPACE.get(TRANSACTION_NAMESPACE_NAME);
  return await (transaction ? task(transaction) : sequelize.transaction(task));
};
