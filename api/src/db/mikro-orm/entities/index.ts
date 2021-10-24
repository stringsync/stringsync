// organize-imports-ignore

// Circular dependencies are possible. The order matters.
import { UserEntity } from './UserEntity';
import { NotationEntity } from './NotationEntity';
import { TagEntity } from './TagEntity';
import { NotationTagEntity } from './NotationTagEntity';

export * from './BaseEntity';
export * from './UserEntity';
export * from './NotationEntity';
export * from './TagEntity';
export * from './NotationTagEntity';

export const ENTITIES = [UserEntity, NotationEntity, TagEntity, NotationTagEntity];

export const ENTITIES_BY_TABLE_NAME = {
  UserEntity: 'users',
  NotationEntity: 'notations',
  TagEntity: 'tags',
  NotationTagEntity: 'notation_tags',
} as const;
