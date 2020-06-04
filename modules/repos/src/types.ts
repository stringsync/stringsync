import { User } from '@stringsync/domain';

export interface Repo<T> {
  get(id: any): Promise<T | null>;
  all(): Promise<T[]>;
  destroyAll(): Promise<void>;
  create(entity: T): Promise<T>;
  update(entity: T): Promise<void>;
}

export interface UserRepo extends Repo<User> {}
