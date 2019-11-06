import { TransactionOptions } from 'sequelize';
import { Tx } from './types';

export const getTransactionOptions = (
  parent?: Tx,
  options?: TransactionOptions
): TransactionOptions => {
  if (options && options.transaction) {
    throw new Error('cannot pass `transaction` to TransactionOptions');
  }
  const transactionOptions = Object.assign({}, options);
  if (parent) {
    transactionOptions.transaction = parent.transaction;
  }
  return transactionOptions;
};
