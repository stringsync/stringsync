import { Db } from '../../db';
import { TransactionOptions } from 'sequelize';
import { v4 } from 'uuid';
import { Tx, TxManager } from './types';
import { getTransactionOptions } from './getTransactionOptions';
import { createTx } from './createTx';

interface TxMap {
  [key: string]: Tx;
}

/**
 * Utility function that hides manual Sequelize transaction management. For a
 * given request, all transactions should be managed by the transaction manager.
 *
 * The transaction manager returns a wrapped Sequelize transaction called a Tx. This
 * object implements the same interface as a Sequelize transaction, but allows the
 * manager to hook into the commit and rollback functions.
 */
export const createTxManager = (db: Db): TxManager => {
  let root: Tx | undefined;
  const txes: TxMap = {};

  const afterClose = (uuid: string) => {
    if (root && root.uuid === uuid) {
      root = undefined;
    }
    delete txes[uuid];
  };

  return {
    get: (uuid?: string) => {
      if (typeof uuid === 'string') {
        return txes[uuid];
      }
      if (root) {
        return txes[root.uuid];
      }
    },
    begin: async (parent?: Tx, options?: TransactionOptions): Promise<Tx> => {
      const opts = getTransactionOptions(parent, options);
      const transaction = await db.transaction(opts);
      const uuid = v4();
      const tx = createTx(uuid, transaction, afterClose);

      txes[uuid] = tx;

      if (!root) {
        root = tx;
      }

      return tx;
    },
  };
};
