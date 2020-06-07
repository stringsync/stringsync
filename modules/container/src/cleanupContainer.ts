import { Container } from 'inversify';
import { Connection } from 'typeorm';
import { RedisClient as Redis } from 'redis';
import { TYPES } from './constants';

export const cleanupContainer = async (container: Container): Promise<void> => {
  const connection = container.get<Connection>(TYPES.Connection);
  await connection.close();

  const redis = container.get<Redis>(TYPES.Redis);
  await new Promise((resolve) => {
    redis.on('end', resolve);
    redis.quit();
  });
};
