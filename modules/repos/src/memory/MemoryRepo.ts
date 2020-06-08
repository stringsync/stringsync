import { Repo } from '../types';
import { randStr, randNum } from '@stringsync/common';
import { injectable } from 'inversify';

@injectable()
export abstract class MemoryRepo<T extends object> implements Repo<T> {
  idName = 'id';
  public readonly store: { [id: number]: T } = {};

  getId(entity: T) {
    const id = entity[this.idName as keyof T];
    return Number(id);
  }

  async find(id: number) {
    const entity = this.store[id] || null;
    return Promise.resolve(entity);
  }

  async findAll() {
    const entities = Object.values(this.store);
    return Promise.resolve(entities);
  }

  async destroyAll() {
    for (const key of Object.keys(this.store)) {
      delete this.store[Number(key)];
    }
  }

  async create(entity: T) {
    const id = this.getId(entity) || this.getUniqId();

    if (id in this.store) {
      throw new Error(`cannot create entity, already exists: ${id}`);
    }

    this.store[id] = { ...entity, id };

    return Promise.resolve({ ...entity, id });
  }

  async update(entity: T) {
    const id = this.getId(entity) || this.getUniqId();

    if (!(id in this.store)) {
      throw new Error(`cannot update entity, does not exist: ${id}`);
    }

    const updatedEntity = { ...entity };
    if ('updatedAt' in updatedEntity) {
      (updatedEntity as any).updatedAt = new Date();
    }
    this.store[id] = updatedEntity;

    return Promise.resolve();
  }

  protected getUniqId() {
    let id: number = randNum(1, 100000);
    while (id in this.store) {
      id = randNum(1, 100000);
    }
    return id;
  }
}
