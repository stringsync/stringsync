import { injectable } from 'inversify';
import { AllowNull, Default, AutoIncrement } from 'sequelize-typescript';
import { Table, Model, PrimaryKey, Column, CreatedAt, UpdatedAt, HasMany, DataType } from 'sequelize-typescript';
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

  @CreatedAt
  @Column
  createdAt!: Date;

  @UpdatedAt
  @Column
  updatedAt!: Date;

  @Column
  username!: string;

  @Column
  email!: string;

  @Column
  encryptedPassword!: string;

  @Default(UserRole.STUDENT)
  @Column(DataType.ENUM(...USER_ROLES))
  role!: UserRole;

  @AllowNull
  @Column
  confirmationToken!: string;

  @AllowNull
  @Column
  confirmedAt!: Date;

  @AllowNull
  @Column
  resetPasswordToken!: string;

  @AllowNull
  @Column
  resetPasswordTokenSentAt!: Date;

  @AllowNull
  @Column
  avatarUrl!: string;
}
