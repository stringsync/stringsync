import { NotationModel } from './NotationModel';
import { TaggingModel } from './TaggingModel';
import { Table, Model, PrimaryKey, Column, BelongsToMany } from 'sequelize-typescript';
import { Tag } from '@stringsync/domain';

@Table({
  tableName: 'tags',
  underscored: true,
  createdAt: false,
  updatedAt: false,
})
export class TagModel extends Model<TagModel> implements Tag {
  @PrimaryKey
  @Column
  id!: string;

  @Column
  name!: string;

  @BelongsToMany(
    () => NotationModel,
    () => TaggingModel
  )
  notations!: NotationModel[];
}
