import { injectable } from 'inversify';
import { createClient, RedisClient } from 'redis';
import { Logger } from '../logger';
import { Cache, RedisConfig } from './types';

@injectable()
export class RedisCache implements Cache {
  static create(config: RedisConfig): RedisClient {
    const { host, port } = config;
    return createClient({ host, port });
  }

  redis: RedisClient;
  logger: Logger;

  constructor(redis: RedisClient, logger: Logger) {
    this.redis = redis;
    this.logger = logger;
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
