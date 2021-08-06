import { Entity, IdentifiedReference, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Tagging as TaggingDomain } from '../../../domain';
import { Tag } from './Tag';

@Entity({ tableName: 'taggings' })
export class Tagging implements TaggingDomain {
  @PrimaryKey()
  id!: string;

  @Property({ persist: false })
  notationId!: string;

  @Property({ persist: false })
  get tagId(): string {
    return this.tag.id;
  }

  @ManyToOne(() => Tag, { wrappedReference: true, persist: false })
  tag!: IdentifiedReference<Tag>;

  // @ManyToOne(() => Notation, { wrappedReference: true })
  // notation!: IdentifiedReference<Notation, 'id'>;
}
