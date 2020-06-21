import { TagEntity } from './TagEntity';
import { UserEntity } from './UserEntity';
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne, ManyToMany } from 'typeorm';
import { JoinTable, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Notation } from '@stringsync/domain';

interface Props extends Omit<Notation, 'transcriber' | 'tags'> {
  transcriber: UserEntity | Promise<UserEntity>;
  tags: TagEntity[] | Promise<TagEntity[]>;
}

@Entity({ name: 'notations' })
export class NotationEntity implements Props {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;

  @Column()
  songName!: string;

  @Column()
  artistName!: string;

  @Column({ type: 'integer', default: 0 })
  deadTimeMs!: number;

  @Column({ type: 'integer', default: 0 })
  durationMs!: number;

  @Column({ type: 'decimal', default: 120 })
  bpm!: number;

  @Column({ default: false })
  featured!: boolean;

  @ManyToOne(
    (type) => UserEntity,
    (transcriber) => transcriber.notations
  )
  @JoinColumn({ name: 'transcriber_id' })
  transcriber!: UserEntity | Promise<UserEntity>;

  @Column({ type: 'int', nullable: true })
  transcriberId!: number;

  @ManyToMany(
    (type) => TagEntity,
    (tag) => tag.notations
  )
  @JoinTable({
    name: 'taggings',
    joinColumn: {
      name: 'notation_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'tag_id',
      referencedColumnName: 'id',
    },
  })
  tags!: TagEntity[] | Promise<TagEntity[]>;
}
