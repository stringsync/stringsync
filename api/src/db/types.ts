export type Task = () => Promise<void>;

export interface Db {
  query<T = unknown>(sql: string): Promise<T[]>;
  checkHealth(): Promise<boolean>;
  init(): Promise<void>;
  transaction(task: Task): Promise<void>;
  closeConnection(): Promise<void>;
  cleanup(): Promise<void>;
}
