import { NotationEntity } from './NotationEntity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { Tag, Notation } from '@stringsync/domain';

@Entity({ name: 'tags' })
export class TagEntity implements Tag {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @ManyToMany(
    (type) => NotationEntity,
    (notation) => notation.tags
  )
  @JoinTable({
    name: 'taggings',
    joinColumn: {
      name: 'tag_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'notation_id',
      referencedColumnName: 'id',
    },
  })
  notations!: Promise<Notation[]>;
}
