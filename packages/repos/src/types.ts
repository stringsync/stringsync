import { User, Notation, Tag, Tagging } from '@stringsync/domain';
import { Connection, ConnectionArgs, NotationConnectionArgs } from '@stringsync/common';

// Repo

export interface Repo<T extends object> {
  count(): Promise<number>;
  find(id: string): Promise<T | null>;
  create(entity: Partial<T>): Promise<T>;
  bulkCreate(entities: Partial<T>[]): Promise<T[]>;
  update(id: string, entity: Partial<T>): Promise<T>;
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
