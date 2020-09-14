import { User, Notation, Tag, Tagging } from '@stringsync/domain';
import { Connection, ConnectionArgs, NotationConnectionArgs } from '@stringsync/common';

// Factory

export interface Factory {
  buildRandUser(attrs: Partial<User>): User;
  buildRandNotation(attrs: Partial<Notation>): Notation;
  buildRandTag(attrs: Partial<Tag>): Tag;
  buildRandTagging(attrs: Partial<Tagging>): Tagging;

  createRandUser(attrs: Partial<User>): Promise<User>;
  createRandNotation(attrs: Partial<Notation>): Promise<Notation>;
  createRandTag(attrs: Partial<Tag>): Promise<Tag>;
  createRandTagging(attrs: Partial<Tagging>): Promise<Tagging>;

  createRandUsers(num: number): Promise<User[]>;
  createRandNotations(num: number): Promise<Notation[]>;
  createRandTags(num: number): Promise<Tag[]>;
  createRandTaggings(num: number): Promise<Tagging[]>;
}

// Repo

export interface Repo<T extends object> {
  count(): Promise<number>;
  find(id: string): Promise<T | null>;
  create(entity: Partial<T>): Promise<T>;
  bulkCreate(entities: Partial<T>[]): Promise<T[]>;
  update(id: string, entity: Partial<T>): Promise<void>;
}

export interface UserRepo extends Repo<User> {
  userLoader: UserLoader;
  findAll(): Promise<User[]>;
  findPage(connectionArgs: ConnectionArgs): Promise<Connection<User>>;
  findByUsernameOrEmail(usernameOrEmail: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByResetPasswordToken(resetPasswordToken: string): Promise<User | null>;
}

export interface NotationRepo extends Repo<Notation> {
  findPage(connectionArgs: NotationConnectionArgs): Promise<Connection<Notation>>;
  findAllByTranscriberId(transcriberId: string): Promise<Notation[]>;
  findAllByTagId(tagId: string): Promise<Notation[]>;
}

export interface TagRepo extends Repo<Tag> {
  findAll(): Promise<Tag[]>;
  findAllByNotationId(notationId: string): Promise<Tag[]>;
}

export interface TaggingRepo extends Repo<Tagging> {}

// Loader

export interface UserLoader {
  findById(id: string): Promise<User | null>;
}

export interface NotationLoader {
  findById(id: string): Promise<Notation | null>;
  findAllByTranscriberId(transcriberId: string): Promise<Notation[]>;
  findAllByTagId(tagId: string): Promise<Notation[]>;
}

export interface TagLoader {
  findById(id: string): Promise<Tag | null>;
  findAllByNotationId(notationId: string): Promise<Tag[]>;
}
