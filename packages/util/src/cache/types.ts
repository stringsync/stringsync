import { RedisClient } from 'redis';

export interface Cache {
  redis: RedisClient;
  cleanup(): Promise<void>;
  teardown(): Promise<void>;
  checkHealth(): Promise<boolean>;
  get(key: string): Promise<string>;
  set(key: string, value: string): Promise<void>;
}
