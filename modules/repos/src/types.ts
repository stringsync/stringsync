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
}

export interface UserLoader {
  findById(id: string): Promise<User | null>;
}

export interface NotationRepo extends Repo<Notation> {
  findByTranscriberId(transcriberId: string): Promise<Notation[]>;
}

export interface NotationLoader {
  findByTranscriberId(transcriberId: string): Promise<Notation[]>;
  findById(id: string): Promise<Notation | null>;
}

export interface TagRepo extends Repo<Tag> {}
