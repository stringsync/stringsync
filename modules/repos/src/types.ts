import { User } from '@stringsync/domain';

export interface Repo<T extends object> {
  pk: string;
  find(id: any): Promise<T | null>;
  findAll(): Promise<T[]>;
  destroyAll(): Promise<void>;
  create(entity: Partial<T>): Promise<T>;
  update(entity: T): Promise<void>;
}

export interface UserRepo extends Repo<User> {}
