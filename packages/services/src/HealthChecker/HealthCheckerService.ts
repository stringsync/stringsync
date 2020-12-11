import { Database, DB } from '@stringsync/db';
import { inject, injectable } from '@stringsync/di';
import { Cache, UTIL } from '@stringsync/util';

const TYPES = { ...DB.TYPES, ...UTIL.TYPES };

@injectable()
export class HealthCheckerService {
  db: Database;
  cache: Cache;

  constructor(@inject(TYPES.Database) db: Database, @inject(TYPES.Cache) cache: Cache) {
    this.db = db;
    this.cache = cache;
  }

  async checkHealth() {
    await Promise.all([this.db.checkHealth(), this.cache.checkHealth()]);
  }
}
