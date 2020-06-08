import { User } from '@stringsync/domain';

export interface Repo<T extends object> {
  idName: string;
  getId(entity: T): number;
  find(id: any): Promise<T | null>;
  findAll(): Promise<T[]>;
  destroyAll(): Promise<void>;
  create(entity: Partial<T>): Promise<T>;
  update(entity: T): Promise<void>;
}

export interface UserRepo extends Repo<User> {
  findByUsernameOrEmail(usernameOrEmail: string): Promise<User | null>;
}
