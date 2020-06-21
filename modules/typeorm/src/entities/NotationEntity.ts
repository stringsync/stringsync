import { TagEntity } from './TagEntity';
import { UserEntity } from '@stringsync/typeorm';
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Notation, Tag } from '@stringsync/domain';

@Entity({ name: 'tags' })
export class NotationEntity implements Notation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  createdAt!: Date;

  @Column()
  updatedAt!: Date;

  @Column()
  songName!: string;

  @Column()
  artistName!: string;

  @Column()
  deadTimeMs!: number;

  @Column()
  durationMs!: number;

  @Column()
  bpm!: number;

  @Column()
  featured!: boolean;

  @ManyToOne(
    (type) => UserEntity,
    (transcriber) => transcriber.notations
  )
  @JoinColumn({ name: 'transcriber_id' })
  transcriber!: UserEntity;

  @ManyToMany(
    (type) => TagEntity,
    (tag) => tag.notations
  )
  @JoinTable({
    name: 'taggings',
    joinColumn: {
      name: 'notations',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'tags',
      referencedColumnName: 'id',
    },
  })
  tags!: Promise<Tag[]>;
}
