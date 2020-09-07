export interface Db {
  connect(...args: any[]): Db;

  cleanup(): void;

  teardown(): void;
}
