import { Repo } from '../types';
import { Db, StaticModel } from '@stringsync/sequelize';
import { TYPES } from '@stringsync/container';
import { inject, injectable } from 'inversify';

@injectable()
export abstract class SequelizeRepo<T extends object, M> implements Repo<T> {
  public readonly db: Db;
  idName = 'id';

  constructor(@inject(TYPES.Db) db: Db) {
    this.db = db;
  }

  protected abstract get model(): StaticModel<M>;

  getId(entity: T): string {
    const id = entity[this.idName as keyof T];
    return String(id);
  }

  async find(id: string | number) {
    const entity = (await this.model.findByPk(id, { raw: true })) as unknown;
    return entity as T | null;
  }

  async findAll() {
    const entities = (await this.model.findAll({ raw: true })) as unknown;
    return entities as T[];
  }

  async destroyAll() {
    await this.model.destroy({ truncate: true });
  }

  async create(entity: T) {
    const newEntity = await this.model.create(entity, { raw: true });
    return newEntity.get({ plain: true }) as T;
  }

  async update(entity: T) {
    const id = this.getId(entity);
    await this.model.update(entity, { where: { [this.idName]: id } });
  }
}
