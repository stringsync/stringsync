import { RedisConfig } from './types';
import { RedisClient, createClient } from 'redis';

export class Redis {
  static create(config: RedisConfig) {
    return createClient({
      host: config.host,
      port: config.port,
    });
  }

  static async cleanup(redis: RedisClient) {
    await new Promise((resolve) => {
      redis.flushall(resolve);
    });
  }

  static async teardown(redis: RedisClient) {
    await new Promise((resolve) => {
      redis.quit();
      redis.on('end', resolve);
    });
  }
}
