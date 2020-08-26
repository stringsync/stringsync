import { Notation } from '@stringsync/domain';
import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  BelongsToMany,
  Column,
  CreatedAt,
  Default,
  ForeignKey,
  Is,
  IsDate,
  IsUrl,
  Length,
  Min,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { TaggingModel } from './TaggingModel';
import { TagModel } from './TagModel';
import { UserModel } from './UserModel';

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

  @IsDate
  @CreatedAt
  @Column
  createdAt!: Date;

  @IsDate
  @UpdatedAt
  @Column
  updatedAt!: Date;

  @Is(/^[A-Za-z0-9!?\s()']*$/)
  @Length({ min: 1, max: 64 })
  @Column
  songName!: string;

  @Is(/^[A-Za-z0-9!?\s()@']*$/)
  @Length({ min: 1, max: 64 })
  @Column
  artistName!: string;

  @Default(0)
  @Column
  deadTimeMs!: number;

  @Min(0)
  @Default(0)
  @Column
  durationMs!: number;

  @Default(false)
  @Column
  featured!: boolean;

  @ForeignKey(() => UserModel)
  @Column
  transcriberId!: string;

  @AutoIncrement
  @Column
  cursor!: number;

  @IsUrl
  @AllowNull
  @Column
  thumbnailUrl!: string;
}
