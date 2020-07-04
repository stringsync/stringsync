import { TagModel } from './TagModel';
import { NotationModel } from './NotationModel';
import { Table, Model, PrimaryKey, Column, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Tagging } from '@stringsync/domain';

@Table({
  tableName: 'taggings',
  underscored: true,
  createdAt: false,
  updatedAt: false,
})
export class TaggingModel extends Model<TaggingModel> implements Tagging {
  @PrimaryKey
  @Column
  id!: string;

  @ForeignKey(() => NotationModel)
  @Column
  notationId!: string;

  @ForeignKey(() => TagModel)
  @Column
  tagId!: string;

  @BelongsTo(() => TagModel, 'tagId')
  tag!: TagModel;

  @BelongsTo(() => NotationModel, 'notationId')
  notation!: NotationModel;
}
