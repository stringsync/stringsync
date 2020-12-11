import { Database, DB_TYPES } from '@stringsync/db';
import { inject, injectable } from '@stringsync/di';
import { Cache, UTIL_TYPES } from '@stringsync/util';

@injectable()
export class HealthCheckerService {
  db: Database;
  cache: Cache;

  constructor(@inject(DB_TYPES.Database) db: Database, @inject(UTIL_TYPES.Cache) cache: Cache) {
    this.db = db;
    this.cache = cache;
  }

  async checkHealth() {
    await Promise.all([this.db.checkHealth(), this.cache.checkHealth()]);
  }
}
