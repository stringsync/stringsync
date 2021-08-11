import { CacheAdapter as ICacheAdapter } from '@mikro-orm/core';
import { Cache } from '../../util';

export type CacheAdapterOptions = {
  cache: Cache;
};

export class CacheAdapter implements ICacheAdapter {
  private readonly cache: Cache;

  constructor(options: CacheAdapterOptions) {
    this.cache = options.cache;
  }

  async get<T = any>(name: string): Promise<T | undefined> {
    const data = await this.cache.get(name);
    return typeof data === 'string' && data.length > 0 ? JSON.parse(data) : undefined;
  }

  async set(name: string, data: any, origin: string, expiration?: number) {
    const json = JSON.stringify(data);
    await this.cache.set(name, json, expiration);
  }

  async clear(): Promise<void> {
    await this.cache.cleanup();
  }
}
