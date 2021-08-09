// organize-imports-ignore

// Circular dependencies are possible. The order matters.
import { UserEntity } from './UserEntity';
import { NotationEntity } from './NotationEntity';
import { TagEntity } from './TagEntity';
import { TaggingEntity } from './TaggingEntity';

export * from './BaseEntity';
export * from './UserEntity';
export * from './NotationEntity';
export * from './TagEntity';
export * from './TaggingEntity';

export const ENTITIES = [UserEntity, NotationEntity, TagEntity, TaggingEntity];

export const ENTITIES_BY_TABLE_NAME = {
  UserEntity: 'users',
  NotationEntity: 'notations',
  TagEntity: 'tags',
  TaggingEntity: 'taggings',
} as const;
