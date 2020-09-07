import { get } from 'lodash';
import { EventEmitter } from 'events';
import { injectable } from 'inversify';
import { AllowNull, Default, AfterUpdate, AfterCreate, AfterDestroy, AfterSave, Unique } from 'sequelize-typescript';
import { Table, Model, PrimaryKey, Column, CreatedAt, UpdatedAt, HasMany, DataType } from 'sequelize-typescript';
import { AfterUpsert, AfterBulkCreate, AfterBulkDestroy, AfterBulkUpdate } from 'sequelize-typescript';
import { IsEmail, IsUrl, IsDate, Is, IsUUID, Length } from 'sequelize-typescript';
import { AutoIncrement } from 'sequelize-typescript';
import { User, UserRole, USER_ROLES } from '@stringsync/domain';
import { NotationModel } from './NotationModel';

@Table({
  tableName: 'users',
  underscored: true,
})
@injectable()
export class UserModel extends Model<UserModel> implements User {
  @PrimaryKey
  @Column
  id!: string;

  @HasMany(() => NotationModel, 'transcriberId')
  notations?: NotationModel[];

  @IsDate
  @CreatedAt
  @Column
  createdAt!: Date;

  @IsDate
  @UpdatedAt
  @Column
  updatedAt!: Date;

  @Is(/^[A-Za-z0-9-_.]*$/)
  @Length({ min: 3, max: 24 })
  @Unique({ name: 'username', msg: 'username already taken' })
  @Column
  username!: string;

  @IsEmail
  @Unique({ name: 'email', msg: 'email already taken' })
  @Column
  email!: string;

  @Column
  encryptedPassword!: string;

  @Default(UserRole.STUDENT)
  @Column(DataType.ENUM(...USER_ROLES))
  role!: UserRole;

  @IsUUID(4)
  @Unique
  @AllowNull
  @Column
  confirmationToken!: string;

  @AllowNull
  @Column
  confirmedAt!: Date;

  @IsUUID(4)
  @AllowNull
  @Column
  resetPasswordToken!: string;

  @IsDate
  @AllowNull
  @Column
  resetPasswordTokenSentAt!: Date;

  @IsUrl
  @AllowNull
  @Column
  avatarUrl!: string;

  @AutoIncrement
  @Column
  rank!: number;
}
