import { Transaction } from 'sequelize';
import { Tx } from './types';

type AfterCloseCallback = (uuid: string) => any;

export const createTx = (
  uuid: string,
  transaction: Transaction,
  afterClose: AfterCloseCallback
): Readonly<Tx> => ({
  uuid,
  transaction,
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
});
