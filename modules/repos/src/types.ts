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
  clearById(id: string): void;
  primeById(id: string, user: User | null): void;
  findById(id: string): Promise<User | null>;
}

export interface NotationRepo extends Repo<Notation> {
  findByTranscriberId(transcriberId: string): Promise<Notation[]>;
}

export interface NotationLoader {
  clearByTranscriberId(transcriberId: string): void;
  primeByTranscriberId(transcriberId: string, notations: Notation[]): void;
  findByTranscriberId(transcriberId: string): Promise<Notation[]>;
}

export interface TagRepo extends Repo<Tag> {}
