import { Transaction, TransactionOptions } from 'sequelize';

export interface Tx {
  uuid: string;
  transaction: Transaction;
  commit: () => Promise<void>;
  rollback: () => Promise<void>;
  afterCommit(fn: (transaction: Transaction) => any): void;
}

export interface TxManager {
  get: (uuid?: string) => Tx | undefined;
  begin: (parent?: Tx, options?: TransactionOptions) => Promise<Tx>;
}
