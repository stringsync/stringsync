import { UserEntity } from '@stringsync/typeorm';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Notation } from '@stringsync/domain';

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

  @OneToOne((type) => UserEntity)
  @JoinColumn()
  transcriberId!: number;
}
