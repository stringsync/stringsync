import { Sequelize } from 'sequelize-typescript';
import { RedisClient as Redis } from 'redis';
import { inject, injectable } from 'inversify';
import { TYPES } from '@stringsync/container';
import { promisify } from 'util';

@injectable()
export class HealthCheckerService {
  sequelize: Sequelize;
  redis: Redis;

  constructor(@inject(TYPES.Sequelize) sequelize: Sequelize, @inject(TYPES.Redis) redis: Redis) {
    this.sequelize = sequelize;
    this.redis = redis;
  }

  async checkHealth() {
    await Promise.all([this.sequelize.authenticate(), promisify(this.redis.time).bind(this.redis)()]);
  }
}
