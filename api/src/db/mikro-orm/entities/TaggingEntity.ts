import { Entity, IdentifiedReference, ManyToOne, PrimaryKey, Property, Reference } from '@mikro-orm/core';
import { Tagging } from '../../../domain';
import { BaseEntity } from './BaseEntity';
import { NotationEntity } from './NotationEntity';
import { TagEntity } from './TagEntity';

@Entity({ tableName: 'taggings' })
export class TaggingEntity extends BaseEntity implements Tagging {
  @PrimaryKey()
  id!: string;

  @Property({ persist: false })
  notationId!: string;

  @Property({ persist: false })
  get tagId(): string {
    return this.tag.id;
  }

  set tagId(tagId: string) {
    const tag = new TagEntity({ id: tagId });
    this.tag = Reference.create(tag);
  }

  @ManyToOne(() => TagEntity, { wrappedReference: true })
  tag!: IdentifiedReference<TagEntity, 'id'>;

  @ManyToOne(() => NotationEntity, { wrappedReference: true })
  notation!: IdentifiedReference<NotationEntity, 'id'>;

  constructor(tagging: Partial<TaggingEntity> = {}) {
    super();
    Object.assign(this, tagging);
  }
}
