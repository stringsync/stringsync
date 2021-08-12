import { Collection, Entity, ManyToMany, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { MaxLength, MinLength } from 'class-validator';
import { Tag } from '../../../domain';
import { BaseEntity } from './BaseEntity';
import { NotationEntity } from './NotationEntity';
import { TaggingEntity } from './TaggingEntity';

@Entity({ tableName: 'tags' })
export class TagEntity extends BaseEntity implements Tag {
  @PrimaryKey()
  id!: string;

  @Property()
  @MaxLength(16)
  @MinLength(1)
  name!: string;

  @OneToMany(
    () => TaggingEntity,
    (tagging) => tagging.tag,
    { inverseJoinColumn: 'tag_id', hidden: true }
  )
  taggings = new Collection<TaggingEntity>(this);

  @ManyToMany({
    entity: () => NotationEntity,
    mappedBy: 'tags',
    hidden: true,
  })
  notations = new Collection<NotationEntity>(this);

  constructor(props: Partial<TagEntity> = {}) {
    super();
    Object.assign(this, props);
  }
}
