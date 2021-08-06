import { Entity, IdentifiedReference, ManyToOne, PrimaryKey, Property, Reference } from '@mikro-orm/core';
import { Tagging as DomainTagging } from '../../../domain';
import { Notation } from './Notation';
import { Tag } from './Tag';

@Entity({ tableName: 'taggings' })
export class Tagging implements DomainTagging {
  @PrimaryKey()
  id!: string;

  @Property({ persist: false })
  notationId!: string;

  @Property({ persist: false })
  get tagId(): string {
    return this.tag.id;
  }

  set tagId(tagId: string) {
    const tag = new Tag({ id: tagId });
    this.tag = Reference.create(tag);
  }

  @ManyToOne(() => Tag, { wrappedReference: true })
  tag!: IdentifiedReference<Tag, 'id'>;

  @ManyToOne(() => Notation, { wrappedReference: true })
  notation!: IdentifiedReference<Notation, 'id'>;

  constructor(tagging: Partial<Tagging> = {}) {
    Object.assign(this, tagging);
  }
}
