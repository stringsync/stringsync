import { Db } from '../../db';
import { TransactionOptions, Transaction } from 'sequelize';
import { v4 } from 'uuid';

interface Tx {
  uuid: string;
  commit: () => Promise<void>;
  rollback: () => Promise<void>;
  afterCommit(fn: (transaction: Transaction) => any): void;
}

interface TransactionMap {
  [key: string]: Transaction;
}

const getTransactionOptions = (
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

/**
 * Utility function that hides manual Sequelize transaction management. For a
 * given request, all transactions should be managed by the transaction manager.
 *
 * The transaction manager returns a wrapped Sequelize transaction called a Tx. This
 * object implements the same interface as a Sequelize transaction, but allows the
 * manager to hook into the commit and rollback functions.
 *
 * The transaction manager only exposes the root transaction via get. Child "transactions"
 * must be managed by the caller. Child "transactions" are implemented as savepoints
 * in Postgres. This was done to keep the internal data structure simple.
 */
export const getTransactionManager = (db: Db) => {
  let root: Tx | undefined;
  const transactions: TransactionMap = {};

  const afterCreate = (tx: Tx) => {
    if (!root) {
      root = tx;
    }
  };

  const afterClose = (uuid: string) => {
    if (root && root.uuid === uuid) {
      root = undefined;
    }
    delete transactions[uuid];
  };

  return {
    get: () => root,
    begin: async (parent?: Tx, options?: TransactionOptions): Promise<Tx> => {
      // create an unmanaged sequelize transaction
      const transaction = await db.transaction(
        getTransactionOptions(transactions, parent, options)
      );
      const uuid = v4();
      transactions[uuid] = transaction;

      // create tx wrapper and return it
      const tx: Tx = {
        uuid,
        commit: async () => {
          await transaction.commit();
          afterClose(uuid);
        },
        rollback: async () => {
          await transaction.rollback();
          afterClose(uuid);
        },
        afterCommit: (callback) => {
          transaction.afterCommit(callback);
        },
      };

      afterCreate(tx);

      return tx;
    },
  };
};
