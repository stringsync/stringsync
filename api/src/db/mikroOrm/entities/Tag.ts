import { Collection, Entity, OneToMany, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { MaxLength, MinLength } from 'class-validator';
import { Tag as TagDomain } from '../../../domain';
import { Tagging } from './Tagging';

type TagProps = {
  name: string;
};

@Entity({ tableName: 'tags' })
export class Tag implements TagDomain {
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

  // @ManyToMany(
  //   () => Notation,
  //   (notation) => notation.taggings,
  //   { cascade: [Cascade.ALL] }
  // )
  // notations = new Collection<Notation>(this);

  constructor(props: TagProps) {
    this.name = props.name;
  }
}
