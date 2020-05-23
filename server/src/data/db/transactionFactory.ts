import { Sequelize, Transaction } from 'sequelize';
import { Namespace } from 'cls-hooked';
import { TRANSACTION_NAMESPACE_NAME } from './constants';
import { Task } from './types';

export const transactionFactory = (
  sequelize: Sequelize,
  namespace: Namespace
) => async <T>(task: Task<T>): Promise<T> => {
  const transaction: Transaction | undefined = namespace.get(
    TRANSACTION_NAMESPACE_NAME
  );
  return await (transaction ? task(transaction) : sequelize.transaction(task));
};
