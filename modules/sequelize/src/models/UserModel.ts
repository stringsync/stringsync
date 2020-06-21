import { Table, Model, PrimaryKey, Column, CreatedAt, UpdatedAt, HasMany, DataType } from 'sequelize-typescript';
import { AllowNull } from 'sequelize-typescript';
import { User, UserRole, USER_ROLES } from '@stringsync/domain';
import { NotationModel } from './NotationModel';

@Table({
  tableName: 'users',
})
export class UserModel extends Model<UserModel> implements User {
  @PrimaryKey
  @Column
  id!: number;

  @HasMany(() => NotationModel)
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

  @Column({ type: DataType.ENUM(...USER_ROLES) })
  role!: UserRole;

  @Column
  @AllowNull
  confirmationToken!: string;

  @Column
  @AllowNull
  confirmedAt!: Date;

  @Column
  @AllowNull
  resetPasswordToken!: string;

  @Column
  @AllowNull
  resetPasswordTokenSentAt!: Date;

  @Column
  @AllowNull
  avatarUrl!: string;
}
