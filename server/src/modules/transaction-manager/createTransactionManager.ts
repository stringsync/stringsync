import { Db } from '../../db';
import { TransactionOptions } from 'sequelize';
import { v4 } from 'uuid';
import { Tx, TransactionMap, TransactionManager } from './types';
import { getTransactionOptions } from './getTransactionOptions';

/**
 * Utility function that hides manual Sequelize transaction management. For a
 * given request, all transactions should be managed by the transaction manager.
 *
 * The transaction manager returns a wrapped Sequelize transaction called a Tx. This
 * object implements the same interface as a Sequelize transaction, but allows the
 * manager to hook into the commit and rollback functions.
 */
export const createTransactionManager = (db: Db): TransactionManager => {
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
    get: (uuid?: string) => {
      if (typeof uuid === 'string') {
        return transactions[uuid];
      }
      if (root) {
        return transactions[root.uuid];
      }
    },
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
