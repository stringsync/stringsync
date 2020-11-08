import { NotFoundError } from '@stringsync/common';
import { injectable } from 'inversify';
import { DocStore } from './types';

@injectable()
export class MemoryDocStore implements DocStore {
  private store: { [key: string]: any } = {};

  async has(key: string): Promise<boolean> {
    return key in this.store;
  }

  async get<T>(key: string): Promise<T> {
    const hasKey = await this.has(key);
    if (!hasKey) {
      throw new NotFoundError(`missing key: ${key}`);
    }
    return this.store[key];
  }

  async set<T>(key: string, value: T): Promise<void> {
    this.store[key] = value;
  }

  async delete<T>(key: string): Promise<void> {
    delete this.store[key];
  }
}
