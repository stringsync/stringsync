export type TransactionCallback<T, R> = (transaction: T) => Promise<R>;

export interface Db {
  transaction<R>(task: TransactionCallback<any, R>): Promise<R>;
  cleanup(): Promise<void>;
  teardown(): Promise<void>;
}
