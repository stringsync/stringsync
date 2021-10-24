import { Collection, Entity, ManyToMany, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { MaxLength, MinLength } from 'class-validator';
import { Tag } from '../../../domain';
import { BaseEntity, BaseEntityOpts } from './BaseEntity';
import { NotationEntity } from './NotationEntity';
import { NotationTagEntity } from './NotationTagEntity';

@Entity({ tableName: 'tags' })
export class TagEntity extends BaseEntity implements Tag {
  @PrimaryKey()
  id!: string;

  @Property()
  @MaxLength(16)
  @MinLength(1)
  name!: string;

  @OneToMany(
    () => NotationTagEntity,
    (notationTag) => notationTag.tag,
    { inverseJoinColumn: 'tag_id', hidden: true }
  )
  notationTags = new Collection<NotationTagEntity>(this);

  @ManyToMany({
    entity: () => NotationEntity,
    mappedBy: 'tags',
    hidden: true,
  })
  notations = new Collection<NotationEntity>(this);

  constructor(attrs: Partial<TagEntity> = {}, opts: BaseEntityOpts = {}) {
    super(opts);
    Object.assign(this, attrs);
  }
}
