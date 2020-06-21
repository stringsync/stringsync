import { TaggingModel } from './TaggingModel';
import { NotationModel } from './NotationModel';
import { Table, Model, PrimaryKey, Column, BelongsToMany } from 'sequelize-typescript';
import { Tag } from '@stringsync/domain';

@Table({
  tableName: 'tags',
})
export class TagModel extends Model<TagModel> implements Tag {
  @PrimaryKey
  @Column
  id!: number;

  @BelongsToMany(
    () => NotationModel,
    () => TaggingModel
  )
  @Column
  notations!: NotationModel[];

  @Column
  name!: string;
}
