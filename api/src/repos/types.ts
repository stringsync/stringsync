import { Notation, NotationTag, Tag, User } from '../domain';
import { Connection, ConnectionArgs, NotationConnectionArgs } from '../util';

export interface Repo<T extends object> {
  count(): Promise<number>;
  find(id: string): Promise<T | null>;
  create(entity: Partial<T>): Promise<T>;
  bulkCreate(entities: Partial<T>[]): Promise<T[]>;
  update(id: string, entity: Partial<T>): Promise<T>;
  validate(entity: T): Promise<void>;
}

export interface UserRepo extends Repo<User> {
  findAll(): Promise<User[]>;
  findPage(connectionArgs: ConnectionArgs): Promise<Connection<User>>;
  findByUsernameOrEmail(usernameOrEmail: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByResetPasswordToken(resetPasswordToken: string): Promise<User | null>;
}

export interface NotationRepo extends Repo<Notation> {
  findPage(connectionArgs: NotationConnectionArgs): Promise<Connection<Notation>>;
  findAll(): Promise<Notation[]>;
  findAllByTranscriberId(transcriberId: string): Promise<Notation[]>;
  findAllByTagId(tagId: string): Promise<Notation[]>;
  findSuggestions(notation: Notation, limit: number): Promise<Notation[]>;
}

export interface TagRepo extends Repo<Tag> {
  findAll(): Promise<Tag[]>;
  findAllByNotationId(notationId: string): Promise<Tag[]>;
  delete(id: string): Promise<void>;
}

export interface NotationTagRepo extends Repo<NotationTag> {}
