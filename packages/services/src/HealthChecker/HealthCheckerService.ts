import { Db } from '@stringsync/db';
import { inject, injectable, TYPES } from '@stringsync/di';
import { Cache } from '@stringsync/util';

@injectable()
export class HealthCheckerService {
  db: Db;
  cache: Cache;

  constructor(@inject(TYPES.Db) db: Db, @inject(TYPES.Cache) cache: Cache) {
    this.db = db;
    this.cache = cache;
  }

  async checkHealth() {
    await Promise.all([this.db.checkHealth(), this.cache.checkHealth()]);
  }
}
