import { DI } from './DI';
import { Cache } from '@stringsync/util';
import { TYPES } from './constants';
import { Db } from '@stringsync/db';

export const useTestContainer = () => {
  const container = DI.create();

  afterEach(async () => {
    const cache = container.get<Cache>(TYPES.Cache);
    const db = container.get<Db>(TYPES.Db);
    await Promise.all([cache.cleanup(), db.cleanup()]);
  });

  afterAll(async () => {
    const cache = container.get<Cache>(TYPES.Cache);
    const db = container.get<Db>(TYPES.Db);
    await Promise.all([cache.teardown(), db.teardown()]);
  });

  return container;
};
