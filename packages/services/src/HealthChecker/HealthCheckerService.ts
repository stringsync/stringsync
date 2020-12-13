import { Database, DB_TYPES } from '@stringsync/db';
import { inject, injectable } from '@stringsync/di';
import { Cache, UTIL_TYPES } from '@stringsync/util';

const TYPES = { ...DB_TYPES, ...UTIL_TYPES };

@injectable()
export class HealthCheckerService {
  constructor(@inject(TYPES.Database) public db: Database, @inject(TYPES.Cache) public cache: Cache) {}

  async checkHealth() {
    await Promise.all([this.db.checkHealth(), this.cache.checkHealth()]);
  }
}
