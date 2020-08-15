import { get } from 'lodash';
import { EventEmitter } from 'events';
import { TaggingModel } from './TaggingModel';
import {
  BelongsToMany,
  ForeignKey,
  DataType,
  AfterCreate,
  AfterDestroy,
  AfterUpdate,
  IsUrl,
  AllowNull,
} from 'sequelize-typescript';
import { AfterSave, AfterUpsert, AfterBulkCreate, AfterBulkUpdate } from 'sequelize-typescript';
import { Table, Model, PrimaryKey, Column, CreatedAt, UpdatedAt, AutoIncrement, Default } from 'sequelize-typescript';
import { BelongsTo, AfterBulkDestroy } from 'sequelize-typescript';
import { IsDate, Min, Length, Is } from 'sequelize-typescript';
import { Notation } from '@stringsync/domain';
import { UserModel } from './UserModel';
import { TagModel } from './TagModel';

@Table({
  tableName: 'notations',
  underscored: true,
})
export class NotationModel extends Model<NotationModel> implements Notation {
  static CLEAR_CACHE = Symbol('CLEAR_CACHE');
  static PRIME_CACHE = Symbol('PRIME_CACHE');

  static emitter = new EventEmitter();

  @AfterCreate
  static afterCreateHook(instance: NotationModel) {
    const notation = instance.get({ plain: true }) as Notation;
    NotationModel.emitPrimeCache(notation.id, notation);
  }

  @AfterDestroy
  static afterDestroyHook(instance: NotationModel) {
    const user = instance.get({ plain: true }) as Notation;
    NotationModel.emitClearCache(user.id);
  }

  @AfterUpdate
  static afterUpdateHook(instance: NotationModel) {
    const user = instance.get({ plain: true }) as Notation;
    NotationModel.emitClearCache(user.id);
  }

  @AfterSave
  static afterSaveHook(instance: NotationModel) {
    const user = instance.get({ plain: true }) as Notation;
    NotationModel.emitPrimeCache(user.id, user);
  }

  @AfterUpsert
  static afterUpsertHook(instance: NotationModel) {
    const user = instance.get({ plain: true }) as Notation;
    NotationModel.emitPrimeCache(user.id, user);
  }

  @AfterBulkCreate
  static afterBulkCreateHook(instances: NotationModel[]) {
    const users = instances.map((instance) => instance.get({ plain: true }) as Notation);
    for (const user of users) {
      NotationModel.emitPrimeCache(user.id, user);
    }
  }

  @AfterBulkDestroy
  static afterBulkDestroyHook(opts: any) {
    const whereId = get(opts, 'where.id', '');
    const ids: unknown[] = Array.isArray(whereId) ? whereId : [whereId];
    for (const id of ids) {
      if (typeof id === 'string') {
        NotationModel.emitClearCache(id);
      }
    }
  }

  @AfterBulkUpdate
  static afterBulkUpdateHooks(opts: any) {
    const whereId = get(opts, 'where.id', '');
    const ids: unknown[] = Array.isArray(whereId) ? whereId : [whereId];
    for (const id of ids) {
      if (typeof id === 'string') {
        NotationModel.emitClearCache(id);
      }
    }
  }

  static emitPrimeCache(id: string, notation: Notation) {
    NotationModel.emitter.emit(NotationModel.PRIME_CACHE, id, notation);
  }

  static emitClearCache(id: string) {
    NotationModel.emitter.emit(NotationModel.CLEAR_CACHE, id);
  }

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
