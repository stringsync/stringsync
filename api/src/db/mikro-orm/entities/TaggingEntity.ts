import { Entity, IdentifiedReference, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { IsNotEmpty } from 'class-validator';
import { Tagging } from '../../../domain';
import { HACK_2099_createReference } from '../hacks';
import { BaseEntity } from './BaseEntity';
import { NotationEntity } from './NotationEntity';
import { TagEntity } from './TagEntity';

@Entity({ tableName: 'taggings' })
export class TaggingEntity extends BaseEntity implements Tagging {
  @PrimaryKey()
  id!: string;

  @ManyToOne(() => NotationEntity, { wrappedReference: true })
  notation?: IdentifiedReference<NotationEntity, 'id'>;

  @Property({ persist: false })
  @IsNotEmpty()
  get notationId(): string {
    return this.notation?.id ?? '';
  }

  set notationId(notationId: string) {
    const notation = new NotationEntity({ id: notationId });
    this.notation = this.notation?.id === notationId ? this.notation : HACK_2099_createReference(notation);
  }

  @ManyToOne(() => TagEntity, { wrappedReference: true })
  tag!: IdentifiedReference<TagEntity, 'id'>;

  @Property({ persist: false })
  @IsNotEmpty()
  get tagId(): string {
    return this.tag?.id ?? '';
  }

  set tagId(tagId: string) {
    const tag = new TagEntity({ id: tagId });
    this.tag = this.tag?.id === tagId ? this.tag : HACK_2099_createReference(tag);
  }

  constructor(tagging: Partial<TaggingEntity> = {}) {
    super();
    Object.assign(this, tagging);
  }
}
