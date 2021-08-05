import { Entity, OneToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Tagging } from '../../../domain';
import { NotationEntity } from './NotationEntity';
import { TagEntity } from './TagEntity';

@Entity({ tableName: 'taggings' })
export class TaggingEntity implements Tagging {
  @PrimaryKey()
  id!: string;

  @Property()
  notationId!: string;

  @Property()
  tagId!: string;

  @OneToOne(() => TagEntity)
  tag!: TagEntity;

  @OneToOne(() => NotationEntity)
  notation!: NotationEntity;
}
