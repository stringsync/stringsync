import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Tag } from '@stringsync/domain';

@Entity({ name: 'tags' })
export class TagEntity implements Tag {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;
}
