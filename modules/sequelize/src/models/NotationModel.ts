import { TaggingModel } from './TaggingModel';
import { Table, Model, PrimaryKey, Column, CreatedAt, UpdatedAt, BelongsTo, HasMany } from 'sequelize-typescript';
import { BelongsToMany } from 'sequelize-typescript';
import { Notation } from '@stringsync/domain';
import { UserModel } from './UserModel';
import { TagModel } from './TagModel';

@Table({
  tableName: 'notations',
})
export class NotationModel extends Model<NotationModel> implements Notation {
  @PrimaryKey
  @Column
  id!: number;

  @BelongsTo(() => UserModel)
  transcriber!: UserModel;

  @BelongsToMany(
    () => TagModel,
    () => TaggingModel
  )
  tags!: TagModel[];

  @CreatedAt
  @Column
  createdAt!: Date;

  @UpdatedAt
  @Column
  updatedAt!: Date;

  @Column
  songName!: string;

  @Column
  artistName!: string;

  @Column
  deadTimeMs!: number;

  @Column
  durationMs!: number;

  @Column
  bpm!: number;

  @Column
  featured!: boolean;

  @Column
  transcriberId!: number;
}
