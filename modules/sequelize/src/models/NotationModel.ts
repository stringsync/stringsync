import { TaggingModel } from './TaggingModel';
import { BelongsToMany, AutoIncrement, ForeignKey, DataType } from 'sequelize-typescript';
import { Table, Model, PrimaryKey, Column, CreatedAt, UpdatedAt, BelongsTo } from 'sequelize-typescript';
import { Notation } from '@stringsync/domain';
import { UserModel } from './UserModel';
import { TagModel } from './TagModel';

@Table({
  tableName: 'notations',
  underscored: true,
})
export class NotationModel extends Model<NotationModel> implements Notation {
  @PrimaryKey
  @Column
  id!: string;

  @BelongsTo(() => UserModel, 'transcriberId')
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

  @Column(DataType.DECIMAL)
  bpm!: number;

  @Column
  featured!: boolean;

  @ForeignKey(() => UserModel)
  @Column
  transcriberId!: string;
}
