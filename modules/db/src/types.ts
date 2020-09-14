import { Notation, Tag, Tagging, User } from '@stringsync/domain';

export { Sequelize } from 'sequelize';

export interface Db {
  cleanup(): Promise<void>;
  teardown(): Promise<void>;
}

export interface Factory {
  buildRandUser(attrs: Partial<User>): User;
  buildRandNotation(attrs: Partial<Notation>): Notation;
  buildRandTag(attrs: Partial<Tag>): Tag;
  buildRandTagging(attrs: Partial<Tagging>): Tagging;

  createRandUser(attrs: { user: Partial<User> }): { user: User };
  createRandNotation(attrs: {
    notation: Partial<Notation>;
    transcriber: Partial<User>;
    tags: Partial<Tag[]>;
  }): { notation: Notation; transcriber: User; tags: Tag[]; taggings: Tagging[] };
  createRandTag(attrs: {
    tag: Partial<Tag>;
    notations: Partial<Notation[]>;
  }): { tag: Tag; taggings: Tagging[]; notations: Notation[] };
  createRandTaggings(attrs: { tagging: Partial<Tagging> }): { tagging: Tagging; tag: Tag; notation: Notation };
}
