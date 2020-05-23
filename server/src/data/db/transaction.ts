import { Db } from './types';
import { Transaction } from 'sequelize';

type AutoCallback<T> = (t: Transaction) => PromiseLike<T>;

/**
 * Utility method that flattens transactions. When a transaction
 * already exists, it uses it. Otherwise, it creates a new transaction.
 */
export const transaction = <T>(db: Db, task: AutoCallback<T>) => {
  const currTransaction = db.namespace.get('transaction');
  return currTransaction
    ? task(currTransaction)
    : db.sequelize.transaction(task);
};
