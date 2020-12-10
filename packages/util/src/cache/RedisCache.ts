import { inject, injectable } from '@stringsync/di';
import { createClient, RedisClient } from 'redis';
import { UtilConfig } from '../config';
import { Logger } from '../logger';
import { UTIL } from '../UTIL';
import { Cache } from './types';

const TYPES = { ...UTIL.TYPES };

@injectable()
export class RedisCache implements Cache {
  logger: Logger;
  redis: RedisClient;

  constructor(@inject(TYPES.Logger) logger: Logger, @inject(TYPES.UtilConfig) config: UtilConfig) {
    this.logger = logger;
    this.redis = createClient({ host: config.REDIS_HOST, port: config.REDIS_PORT });
  }

  async cleanup() {
    await new Promise((resolve) => {
      this.redis.flushall(resolve);
    });
  }

  async teardown() {
    await new Promise((resolve) => {
      this.redis.quit();
      this.redis.on('end', resolve);
    });
  }

  async checkHealth() {
    return await new Promise<boolean>((resolve) => {
      this.redis.time((err, res) => {
        if (err) {
          this.logger.error(`RedisCache health check failed: ${err.message}`);
          resolve(false);
          return;
        }
        this.logger.info(`RedisCache health check successful: ${res}`);
        resolve(true);
      });
    });
  }

  async get(key: string) {
    return await new Promise<string>((resolve, reject) => {
      this.redis.get(key, (err, res) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(res || '');
      });
    });
  }

  async set(key: string, value: string) {
    await new Promise((resolve, reject) => {
      this.redis.set(key, value, (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  }
}
