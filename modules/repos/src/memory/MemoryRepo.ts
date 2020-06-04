import { Repo } from '../types';

export abstract class MemoryRepo<T> implements Repo<T> {
  public readonly store: { [id: string]: T } = {};

  protected abstract getId(entity: T): string;

  async get(id: string) {
    const entity = this.store[id] || null;
    return Promise.resolve(entity);
  }

  async all() {
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
    const id = this.getId(entity);

    if (!(id in this.store)) {
      throw new Error(`cannot update entity, does not exist: ${id}`);
    }

    this.store[id] = { ...entity };

    return Promise.resolve();
  }
}
