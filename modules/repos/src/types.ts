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
  startListeningForChanges(): void;
  stopListeningForChanges(): void;
}

export interface NotationRepo extends Repo<Notation> {
  findAllByTranscriberId(transcriberId: string): Promise<Notation[]>;
  findAllByTagId(tagId: string): Promise<Notation[]>;
}

export interface NotationLoader {
  findById(id: string): Promise<Notation | null>;
  findAllByTranscriberId(transcriberId: string): Promise<Notation[]>;
  findAllByTagId(tagId: string): Promise<Notation[]>;
  startListeningForChanges(): void;
  stopListeningForChanges(): void;
}

export interface TagRepo extends Repo<Tag> {
  findAllByNotationId(notationId: string): Promise<Tag[]>;
}

export interface TagLoader {
  findById(id: string): Promise<Tag | null>;
  findAllByNotationId(notationId: string): Promise<Tag[]>;
  startListeningForChanges(): void;
  stopListeningForChanges(): void;
}
