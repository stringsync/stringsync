import { Collection, Entity, ManyToMany, OneToMany, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { MaxLength, MinLength } from 'class-validator';
import { Tag as DomainTag } from '../../../domain';
import { Notation } from './Notation';
import { Tagging } from './Tagging';

@Entity({ tableName: 'tags' })
export class Tag implements DomainTag {
  @PrimaryKey()
  id!: string;

  @Property()
  @Unique()
  @MaxLength(16)
  @MinLength(1)
  name!: string;

  @OneToMany(
    () => Tagging,
    (tagging) => tagging.tag,
    { inverseJoinColumn: 'tag_id' }
  )
  taggings = new Collection<Tagging>(this);

  @ManyToMany({
    entity: () => Notation,
    mappedBy: 'tags',
  })
  notations = new Collection<Notation>(this);

  constructor(props: Partial<Tag> = {}) {
    Object.assign(this, props);
  }
}
