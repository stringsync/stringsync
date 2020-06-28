import { User, Notation, Tag } from '@stringsync/domain';

export interface Repo<T extends object> {
  find(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(entity: Partial<T>): Promise<T>;
  bulkCreate(entity: Partial<T>[]): Promise<T[]>;
  update(id: string, entity: Partial<T>): Promise<void>;
  count(): Promise<number>;
}

export interface UserRepo extends Repo<User> {
  findByUsernameOrEmail(usernameOrEmail: string): Promise<User | null>;
  findAllByIds(ids: string[]): Promise<User[]>;
}

export interface NotationRepo extends Repo<Notation> {
  findAllByTranscriberIds(transcriberIds: string[]): Promise<Notation[]>;
}

export interface TagRepo extends Repo<Tag> {}
