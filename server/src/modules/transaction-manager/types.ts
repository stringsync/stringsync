import { Transaction, TransactionOptions } from 'sequelize';

export interface Tx {
  uuid: string;
  commit: () => Promise<void>;
  rollback: () => Promise<void>;
  afterCommit(fn: (transaction: Transaction) => any): void;
}

export interface TransactionMap {
  [key: string]: Transaction;
}

export interface TransactionManager {
  get: () => Transaction | undefined;
  begin: (parent?: Tx, options?: TransactionOptions) => Promise<Tx>;
}
