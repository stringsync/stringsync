import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { MaxLength, MinLength } from 'class-validator';
import { Tag } from '../../../domain';

@Entity({ tableName: 'tags' })
export class TagEntity implements Tag {
  @PrimaryKey()
  id!: string;

  @Property()
  @Unique()
  @MaxLength(16)
  @MinLength(1)
  name!: string;
}
