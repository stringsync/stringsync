import { EntityManager } from '@mikro-orm/core';

export enum Orm {
  MikroORM,
}

export type TaskCtx = { type: Orm.MikroORM; em: EntityManager };

export type Task = (ctx: TaskCtx) => Promise<void>;

export interface Db {
  ormType: Orm;
  query<T = unknown>(sql: string): Promise<T[]>;
  checkHealth(): Promise<boolean>;
  init(): Promise<void>;
  transaction(task: Task): Promise<void>;
  closeConnection(): Promise<void>;
  cleanup(): Promise<void>;
}
