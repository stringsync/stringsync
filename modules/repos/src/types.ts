import { User, Notation, Tag, Tagging } from '@stringsync/domain';

export interface Repo<T extends object> {
  count(): Promise<number>;
  find(id: string): Promise<T | null>;
  create(entity: Partial<T>): Promise<T>;
  bulkCreate(entity: Partial<T>[]): Promise<T[]>;
  update(id: string, entity: Partial<T>): Promise<void>;
}

export interface UserRepo extends Repo<User> {
  findAll(): Promise<User[]>;
  findByUsernameOrEmail(usernameOrEmail: string): Promise<User | null>;
}

export interface NotationRepo extends Repo<Notation> {
  findAllByTranscriberId(transcriberId: string): Promise<Notation[]>;
  findAllByTagId(tagId: string): Promise<Notation[]>;
}

export interface TagRepo extends Repo<Tag> {
  findAll(): Promise<Tag[]>;
  findAllByNotationId(notationId: string): Promise<Tag[]>;
}

export interface TaggingRepo extends Repo<Tagging> {}

export interface UserLoader {
  findById(id: string): Promise<User | null>;
  startListeningForChanges(): void;
  stopListeningForChanges(): void;
}

export interface NotationLoader {
  findById(id: string): Promise<Notation | null>;
  findAllByTranscriberId(transcriberId: string): Promise<Notation[]>;
  findAllByTagId(tagId: string): Promise<Notation[]>;
  startListeningForChanges(): void;
  stopListeningForChanges(): void;
}

export interface TagLoader {
  findById(id: string): Promise<Tag | null>;
  findAllByNotationId(notationId: string): Promise<Tag[]>;
  startListeningForChanges(): void;
  stopListeningForChanges(): void;
}
