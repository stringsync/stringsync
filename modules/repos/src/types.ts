import { User, Notation } from '@stringsync/domain';

export interface Repo<T extends object> {
  find(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  destroyAll(): Promise<void>;
  create(entity: Partial<T>): Promise<T>;
  update(entity: T): Promise<void>;
  count(): Promise<number>;
}

export interface UserRepo extends Repo<User> {
  findByUsernameOrEmail(usernameOrEmail: string): Promise<User | null>;
}

export interface NotationRepo extends Repo<Notation> {}
