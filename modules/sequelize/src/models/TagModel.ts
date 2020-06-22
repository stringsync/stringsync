import { NotationModel } from './NotationModel';
import { TaggingModel } from './TaggingModel';
import { Table, Model, PrimaryKey, Column, BelongsToMany, AutoIncrement } from 'sequelize-typescript';
import { Tag } from '@stringsync/domain';

@Table({
  tableName: 'tags',
  underscored: true,
})
export class TagModel extends Model<TagModel> implements Tag {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  // @BelongsToMany(
  //   () => NotationModel,
  //   () => TaggingModel
  // )
  // @Column
  // notations!: NotationModel[];

  @Column
  name!: string;
}
