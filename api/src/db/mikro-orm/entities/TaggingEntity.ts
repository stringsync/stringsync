import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { IsNotEmpty } from 'class-validator';
import { Tagging } from '../../../domain';
import { HACK_2099_createReference } from '../hacks';
import { BaseEntity } from './BaseEntity';
import { NotationEntity } from './NotationEntity';
import { TagEntity } from './TagEntity';

@Entity({ tableName: 'taggings' })
export class TaggingEntity extends BaseEntity implements Tagging {
  associations = ['tag', 'notation'];

  @PrimaryKey()
  id!: string;

  @ManyToOne(() => NotationEntity, { wrappedReference: true })
  notation = HACK_2099_createReference(new NotationEntity());

  @Property({ persist: false })
  @IsNotEmpty()
  get notationId(): string {
    return this.notation?.id ?? '';
  }

  set notationId(notationId: string) {
    if (this.notation.id === notationId) {
      return;
    }
    const notation = new NotationEntity({ id: notationId });
    this.notation.set(HACK_2099_createReference(notation));
  }

  @ManyToOne(() => TagEntity, { wrappedReference: true })
  tag = HACK_2099_createReference(new TagEntity());

  @Property({ persist: false })
  @IsNotEmpty()
  get tagId(): string {
    return this.tag?.id ?? '';
  }

  set tagId(tagId: string) {
    if (this.tag.id === tagId) {
      return;
    }
    const tag = new TagEntity({ id: tagId });
    this.tag.set(HACK_2099_createReference(tag));
  }

  constructor(tagging: Partial<TaggingEntity> = {}) {
    super();
    Object.assign(this, tagging);
  }
}
