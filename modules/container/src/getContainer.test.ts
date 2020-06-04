import { getContainer } from './getContainer';
import { getContainerConfig } from '@stringsync/config';
import { Container } from 'inversify';
import { Db } from '@stringsync/sequelize';
import { TYPES } from './constants';
import { Redis } from 'ioredis';

let container: Container | undefined;

afterEach(async () => {
  if (container) {
    const db = container.get<Db>(TYPES.Db);
    const redis = container.get<Redis>(TYPES.Redis);
    await db.sequelize.close();
    redis.disconnect();
  }
  container = undefined;
});

it('runs without crashing', () => {
  const config = getContainerConfig();
  expect(() => {
    container = getContainer(config);
  }).not.toThrow();
});
