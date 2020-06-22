import { TagModel } from './TagModel';
import { NotationModel } from './NotationModel';
import { Table, Model, PrimaryKey, Column, ForeignKey, AutoIncrement } from 'sequelize-typescript';
import { Tagging } from '@stringsync/domain';

@Table({
  tableName: 'taggings',
  underscored: true,
})
export class TaggingModel extends Model<TaggingModel> implements Tagging {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @ForeignKey(() => NotationModel)
  @Column
  notationId!: number;

  @ForeignKey(() => TagModel)
  @Column
  tagId!: number;
}
