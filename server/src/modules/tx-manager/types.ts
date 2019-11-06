import { Transaction, TransactionOptions } from 'sequelize';
import { Db } from '../../db';

export interface Tx {
  uuid: string;
  transaction: Transaction;
  commit: () => Promise<void>;
  rollback: () => Promise<void>;
  afterCommit(fn: (transaction: Transaction) => any): void;
}

export interface TxManager {
  db: Db;
  getRootTransaction: () => Transaction | undefined;
  getRootTx: () => Tx | undefined;
  getTx: (uuid?: string) => Tx | undefined;
  begin: (parent?: Tx, options?: TransactionOptions) => Promise<Tx>;
}
