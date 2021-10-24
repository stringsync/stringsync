import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { IsNotEmpty } from 'class-validator';
import { NotationTag } from '../../../domain';
import { HACK_2099_createReference } from '../hacks';
import { BaseEntity, BaseEntityOpts } from './BaseEntity';
import { NotationEntity } from './NotationEntity';
import { TagEntity } from './TagEntity';

@Entity({ tableName: 'notation_tags' })
export class NotationTagEntity extends BaseEntity implements NotationTag {
  @PrimaryKey()
  id!: string;

  @ManyToOne(() => NotationEntity, { wrappedReference: true, hidden: true })
  notation = HACK_2099_createReference(new NotationEntity());

  @Property({ persist: false })
  @IsNotEmpty()
  get notationId(): string {
    return this.notation.id;
  }

  set notationId(notationId: string) {
    if (notationId === this.notationId) {
      return;
    }
    this.notation.set(HACK_2099_createReference(new NotationEntity({ id: notationId })));
  }

  @ManyToOne(() => TagEntity, { wrappedReference: true, hidden: true })
  tag = HACK_2099_createReference(new TagEntity());

  @Property({ persist: false })
  @IsNotEmpty()
  get tagId(): string {
    return this.tag.id;
  }

  set tagId(tagId: string) {
    if (tagId === this.tagId) {
      return;
    }
    this.tag.set(HACK_2099_createReference(new TagEntity({ id: tagId })));
  }

  constructor(attrs: Partial<NotationTagEntity> = {}, opts: BaseEntityOpts = {}) {
    super(opts);
    Object.assign(this, attrs);
  }
}
