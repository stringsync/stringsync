import { RedisClient as Redis } from 'redis';
import { inject, injectable } from 'inversify';
import { TYPES } from '@stringsync/container';
import { Connection } from 'typeorm';
import { promisify } from 'util';

@injectable()
export class HealthCheckerService {
  readonly connection: Connection;
  readonly redis: Redis;

  constructor(@inject(TYPES.Connection) connection: Connection, @inject(TYPES.Redis) redis: Redis) {
    this.connection = connection;
    this.redis = redis;
  }

  async checkHealth() {
    await this.connection.query('SELECT NOW();');
    await promisify(this.redis.time).bind(this.redis)();
  }
}
