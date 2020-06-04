import { Repo } from '../types';
import { Db, StaticModel } from '@stringsync/sequelize';
import { TYPES } from '@stringsync/container';
import { inject, injectable } from 'inversify';

@injectable()
export abstract class SequelizeRepo<T extends object, M> implements Repo<T> {
  public readonly db: Db;

  constructor(@inject(TYPES.Db) db: Db) {
    this.db = db;
  }

  protected abstract get model(): StaticModel<M>;

  protected abstract get idName(): string;

  protected abstract getId(entity: T): string;

  async get(id: string | number) {
    const entity = (await this.model.findByPk(id, { raw: true })) as unknown;
    return entity as T | null;
  }

  async all() {
    const entities = (await this.model.findAll({ raw: true })) as unknown;
    return entities as T[];
  }

  async destroyAll() {
    await this.model.destroy({ truncate: true });
  }

  async create(entity: T) {
    const newEntitiy = this.model.create(entity, { raw: true }) as unknown;
    return newEntitiy as T;
  }

  async update(entity: T) {
    const id = this.getId(entity);
    await this.model.update(entity, { where: { [this.idName]: id } });
  }
}
