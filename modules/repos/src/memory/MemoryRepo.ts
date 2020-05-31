import { Repo } from '../Repo';

export abstract class MemoryRepo<T> extends Repo<T> {
  public readonly store: { [id: string]: T } = {};

  protected abstract getId(entity: T): string;

  async get(id: string) {
    const entity = this.store[id] || null;
    return Promise.resolve(entity);
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
