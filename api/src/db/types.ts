import { injectable } from 'inversify';

export type Task = () => Promise<void>;

@injectable()
export abstract class Db {
  async cleanup() {
    const env = process.env.NODE_ENV;
    if (env !== 'development' && env !== 'test') {
      throw new Error(`can only cleanup in development and test environemnts, got: ${env}`);
    }
    await this.doCleanup();
  }

  abstract query<T>(sql: string): Promise<T[]>;
  abstract init(): Promise<void>;
  abstract transaction(task: Task): Promise<void>;
  abstract closeConnection(): Promise<void>;

  protected abstract doCleanup(): Promise<void>;
}
