import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Tagging } from '@stringsync/domain';

@Entity({ name: 'taggings' })
export class TaggingEntity implements Tagging {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  notationId!: number;

  @Column()
  tagId!: number;
}
