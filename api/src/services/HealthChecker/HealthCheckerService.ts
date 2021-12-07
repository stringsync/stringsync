import { inject, injectable } from 'inversify';
import { Db } from '../../db';
import { TYPES } from '../../inversify.constants';
import { Cache } from '../../util';

@injectable()
export class HealthCheckerService {
  constructor(@inject(TYPES.Db) public db: Db, @inject(TYPES.Cache) public cache: Cache) {}

  async checkHealth() {
    const [isDbHealthy, isCacheHealthy] = await Promise.all([this.db.checkHealth(), this.cache.checkHealth()]);
    return { isDbHealthy, isCacheHealthy };
  }
}
