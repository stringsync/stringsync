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
  static CLEAR_CACHE = Symbol('CLEAR_CACHE');
  static PRIME_CACHE = Symbol('PRIME_CACHE');

  static emitter = new EventEmitter();

  @AfterCreate
  static afterCreateHook(instance: UserModel) {
    const user = instance.get({ plain: true }) as User;
    UserModel.emitPrimeCache(user.id, user);
  }

  @AfterDestroy
  static afterDestroyHook(instance: UserModel) {
    const user = instance.get({ plain: true }) as User;
    UserModel.emitClearCache(user.id);
  }

  @AfterUpdate
  static afterUpdateHook(instance: UserModel) {
    const user = instance.get({ plain: true }) as User;
    UserModel.emitClearCache(user.id);
  }

  @AfterSave
  static afterSaveHook(instance: UserModel) {
    const user = instance.get({ plain: true }) as User;
    UserModel.emitPrimeCache(user.id, user);
  }

  @AfterUpsert
  static afterUpsertHook(instance: UserModel) {
    const user = instance.get({ plain: true }) as User;
    UserModel.emitPrimeCache(user.id, user);
  }

  @AfterBulkCreate
  static afterBulkCreateHook(instances: UserModel[]) {
    const users = instances.map((instance) => instance.get({ plain: true }) as User);
    for (const user of users) {
      UserModel.emitPrimeCache(user.id, user);
    }
  }

  @AfterBulkDestroy
  static afterBulkDestroyHook(opts: any) {
    const whereId = get(opts, 'where.id', '');
    const ids: unknown[] = Array.isArray(whereId) ? whereId : [whereId];
    for (const id of ids) {
      if (typeof id === 'string') {
        UserModel.emitClearCache(id);
      }
    }
  }

  @AfterBulkUpdate
  static afterBulkUpdateHooks(opts: any) {
    const whereId = get(opts, 'where.id', '');
    const ids: unknown[] = Array.isArray(whereId) ? whereId : [whereId];
    for (const id of ids) {
      if (typeof id === 'string') {
        UserModel.emitClearCache(id);
      }
    }
  }

  static emitPrimeCache(id: string, user: User) {
    UserModel.emitter.emit(UserModel.PRIME_CACHE, id, user);
  }

  static emitClearCache(id: string) {
    UserModel.emitter.emit(UserModel.CLEAR_CACHE, id);
  }

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
  @Unique
  @Column
  username!: string;

  @IsEmail
  @Unique
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
