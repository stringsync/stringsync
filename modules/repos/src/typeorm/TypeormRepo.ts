import { Repo } from '../types';
import { Connection, getRepository, Repository, ObjectType } from 'typeorm';

export abstract class TypeormRepo<T extends object> implements Repo<T> {
  idName = 'id';

  readonly connection: Connection;
  readonly entityClass: ObjectType<T>;

  protected repo: Repository<T>;

  constructor(connection: Connection, entityClass: ObjectType<T>) {
    this.connection = connection;
    this.entityClass = entityClass;

    this.repo = getRepository<T>(entityClass);
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
