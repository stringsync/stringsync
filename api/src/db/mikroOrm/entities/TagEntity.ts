import { Cascade, Collection, Entity, ManyToMany, OneToMany, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { MaxLength, MinLength } from 'class-validator';
import { Tag } from '../../../domain';
import { NotationEntity } from './NotationEntity';
import { TaggingEntity } from './TaggingEntity';

@Entity({ tableName: 'tags' })
export class TagEntity implements Tag {
  @PrimaryKey()
  id!: string;

  @Property()
  @Unique()
  @MaxLength(16)
  @MinLength(1)
  name!: string;

  @OneToMany(
    () => TaggingEntity,
    (tagging) => tagging.tag,
    { cascade: [Cascade.ALL] }
  )
  taggings = new Collection<TaggingEntity>(this);

  @ManyToMany(
    () => NotationEntity,
    () => TaggingEntity,
    { cascade: [Cascade.ALL] }
  )
  notations = new Collection<NotationEntity>(this);
}
