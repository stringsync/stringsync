import { Repo } from '../types';
import { randStr } from '@stringsync/common';
import { set } from 'lodash';

export abstract class MemoryRepo<T extends object> implements Repo<T> {
  idName = 'id';
  public readonly store: { [id: string]: T } = {};

  getId(entity: T) {
    const id = entity[this.idName as keyof T];
    return String(id);
  }

  async find(id: string) {
    const entity = this.store[id] || null;
    return Promise.resolve(entity);
  }

  async findAll() {
    const entities = Object.values(this.store);
    return Promise.resolve(entities);
  }

  async destroyAll() {
    for (const key of Object.keys(this.store)) {
      delete this.store[key];
    }
  }

  async create(entity: T) {
    const id = this.getId(entity);

    if (id in this.store) {
      throw new Error(`cannot create entity, already exists: ${id}`);
    }

    this.store[id] = { ...entity };

    return Promise.resolve({ ...entity });
  }

  async update(entity: T) {
    const id = this.getId(entity) || this.getUniqId();

    if (!(id in this.store)) {
      throw new Error(`cannot update entity, does not exist: ${id}`);
    }

    const updatedEntity = { ...entity };
    if ('updatedAt' in updatedEntity) {
      set(updatedEntity, 'updatedAt', new Date());
    }
    this.store[id] = updatedEntity;

    return Promise.resolve();
  }

  protected getUniqId() {
    const ids = new Set(Object.keys(this.store));
    let id: string = randStr(8);
    while (ids.has(id)) {
      id = randStr(8);
    }
    return id;
  }
}
