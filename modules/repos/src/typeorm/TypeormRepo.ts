import { Repo } from '../types';
import { Connection, getRepository, ObjectType } from 'typeorm';
import { injectable, inject } from 'inversify';
import { TYPES } from '@stringsync/container';

@injectable()
export abstract class TypeormRepo<T extends object> implements Repo<T> {
  abstract entityClass: ObjectType<T>;
  idName = 'id';

  readonly connection: Connection;

  constructor(@inject(TYPES.Connection) connection: Connection) {
    this.connection = connection;
  }

  get repo() {
    return getRepository(this.entityClass);
  }

  getId(entity: T) {
    return this.repo.getId(entity);
  }

  async find(id: string) {
    const entity = await this.repo.findOne(id);
    return entity || null;
  }

  async exists(id: string) {
    return (await this.find(id)) !== null;
  }

  async findAll() {
    return await this.repo.find();
  }

  async create(entity: T) {
    const newEntity = this.repo.create(entity);

    const id = this.getId(entity);
    if (id && (await this.exists(id))) {
      throw new Error(`${id} already exists`);
    }

    return await this.repo.save(newEntity);
  }

  async destroyAll() {
    await this.repo.clear();
  }

  async update(entity: T) {
    this.repo.update(this.getId(entity), entity);
  }
}
