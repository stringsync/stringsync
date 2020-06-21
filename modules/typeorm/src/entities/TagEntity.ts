import { NotationEntity } from './NotationEntity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { Tag } from '@stringsync/domain';

interface Props extends Omit<Tag, 'notations'> {
  notations: NotationEntity[] | Promise<NotationEntity[]>;
}

@Entity({ name: 'tags' })
export class TagEntity implements Props {
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
  notations!: NotationEntity[] | Promise<NotationEntity[]>;
}
