import { inject, injectable } from 'inversify';
import { RedisClient } from 'redis';
import { TYPES } from '../../inversify.constants';
import { Logger } from '../logger';
import { Cache } from './types';

@injectable()
export class RedisCache implements Cache {
  constructor(@inject(TYPES.Logger) private logger: Logger, @inject(TYPES.Redis) private redis: RedisClient) {}

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
        resolve(undefined);
      });
    });
  }
}
