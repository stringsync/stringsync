import { get } from 'lodash';
import { EventEmitter } from 'events';
import { NotationModel } from './NotationModel';
import { TaggingModel } from './TaggingModel';
import { Table, Model, PrimaryKey, Column, BelongsToMany } from 'sequelize-typescript';
import { AfterUpdate, AfterCreate, AfterDestroy, AfterSave } from 'sequelize-typescript';
import { AfterUpsert, AfterBulkCreate, AfterBulkDestroy, AfterBulkUpdate } from 'sequelize-typescript';
import { Tag } from '@stringsync/domain';

@Table({
  tableName: 'tags',
  underscored: true,
  createdAt: false,
  updatedAt: false,
})
export class TagModel extends Model<TagModel> implements Tag {
  static CLEAR_CACHE = Symbol('CLEAR_CACHE');
  static PRIME_CACHE = Symbol('PRIME_CACHE');

  static emitter = new EventEmitter();

  @AfterCreate
  static afterCreateHook(instance: TagModel) {
    const tag = instance.get({ plain: true }) as Tag;
    TagModel.emitPrimeCache(tag.id, tag);
  }

  @AfterDestroy
  static afterDestroyHook(instance: TagModel) {
    const tag = instance.get({ plain: true }) as Tag;
    TagModel.emitClearCache(tag.id);
  }

  @AfterUpdate
  static afterUpdateHook(instance: TagModel) {
    const tag = instance.get({ plain: true }) as Tag;
    TagModel.emitClearCache(tag.id);
  }

  @AfterSave
  static afterSaveHook(instance: TagModel) {
    const tag = instance.get({ plain: true }) as Tag;
    TagModel.emitPrimeCache(tag.id, tag);
  }

  @AfterUpsert
  static afterUpsertHook(instance: TagModel) {
    const tag = instance.get({ plain: true }) as Tag;
    TagModel.emitPrimeCache(tag.id, tag);
  }

  @AfterBulkCreate
  static afterBulkCreateHook(instances: TagModel[]) {
    const tags = instances.map((instance) => instance.get({ plain: true }) as Tag);
    for (const tag of tags) {
      TagModel.emitPrimeCache(tag.id, tag);
    }
  }

  @AfterBulkDestroy
  static afterBulkDestroyHook(opts: any) {
    const whereId = get(opts, 'where.id', '');
    const ids: unknown[] = Array.isArray(whereId) ? whereId : [whereId];
    for (const id of ids) {
      if (typeof id === 'string') {
        TagModel.emitClearCache(id);
      }
    }
  }

  @AfterBulkUpdate
  static afterBulkUpdateHooks(opts: any) {
    const whereId = get(opts, 'where.id', '');
    const ids: unknown[] = Array.isArray(whereId) ? whereId : [whereId];
    for (const id of ids) {
      if (typeof id === 'string') {
        TagModel.emitClearCache(id);
      }
    }
  }

  static emitPrimeCache(id: string, tag: Tag) {
    TagModel.emitter.emit(TagModel.PRIME_CACHE, id, tag);
  }

  static emitClearCache(id: string) {
    TagModel.emitter.emit(TagModel.CLEAR_CACHE, id);
  }

  @PrimaryKey
  @Column
  id!: string;

  @BelongsToMany(
    () => NotationModel,
    () => TaggingModel
  )
  notations!: NotationModel[];

  @Column
  name!: string;
}
