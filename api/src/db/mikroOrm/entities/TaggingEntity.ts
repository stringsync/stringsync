import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Tagging } from '../../../domain';

@Entity({ tableName: 'taggings' })
export class TaggingEntity implements Tagging {
  @PrimaryKey()
  id!: string;

  @Property()
  notationId!: string;

  @Property()
  tagId!: string;
}
