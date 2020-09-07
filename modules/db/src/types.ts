export interface Db {
  transaction<T extends any>(task: () => Promise<T>): Promise<T>;

  cleanup(): Promise<void>;

  teardown(): Promise<void>;
}
