import { TagModel } from './TagModel';
import { NotationModel } from './NotationModel';
import { Table, Model, PrimaryKey, Column, ForeignKey } from 'sequelize-typescript';
import { Tagging } from '@stringsync/domain';

@Table({
  tableName: 'taggings',
})
export class TaggingModel extends Model<TaggingModel> implements Tagging {
  @PrimaryKey
  @Column
  id!: number;

  @ForeignKey(() => NotationModel)
  @Column
  notationId!: number;

  @ForeignKey(() => TagModel)
  @Column
  tagId!: number;
}
