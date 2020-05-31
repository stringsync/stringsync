import { Db } from '@stringsync/repos';
import { Redis } from 'ioredis';

export class HealthCheckerService {
  readonly db: Db;
  readonly redis: Redis;

  constructor(db: Db, redis: Redis) {
    this.db = db;
    this.redis = redis;
  }

  async checkHealth() {
    await this.db.sequelize.authenticate();
    await this.redis.time();
  }
}
