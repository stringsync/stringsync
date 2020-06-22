import { Sequelize } from 'sequelize-typescript';
import { Container } from 'inversify';
import { RedisClient as Redis } from 'redis';
import { TYPES } from './constants';

export const cleanupContainer = async (container: Container): Promise<void> => {
  const sequelize = container.get<Sequelize>(TYPES.Sequelize);
  const connectionPromise = sequelize.close();

  const redis = container.get<Redis>(TYPES.Redis);
  const redisPromise = new Promise((resolve) => {
    redis.on('end', resolve);
    redis.quit();
  });

  await Promise.all([connectionPromise, redisPromise]);
};
