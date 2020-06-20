import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
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

  @Column()
  transcriberId!: number;
}
