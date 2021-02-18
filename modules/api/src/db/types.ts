export type Task = () => Promise<void>;

export interface Db {
  transaction(task: Task): Promise<void>;
  teardown(): Promise<void>;
}
