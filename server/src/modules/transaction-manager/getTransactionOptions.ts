import { TransactionOptions } from 'sequelize';
import { Tx, TransactionMap } from './types';

export const getTransactionOptions = (
  transactions: TransactionMap,
  parent?: Tx,
  options?: TransactionOptions
): TransactionOptions => {
  if (options && options.transaction) {
    throw new Error('cannot pass `transaction` to TransactionOptions');
  }
  const transactionOptions = Object.assign({}, options);
  if (parent) {
    transactionOptions.transaction = transactions[parent.uuid];
  }
  return transactionOptions;
};
