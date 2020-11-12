import { Db } from '@stringsync/db';
import { Cache } from '@stringsync/util';
import { UpdateVideoUrlQueue, UpdateVideoUrlWorker } from '../../jobs/src';
import { DI } from './DI';
import { TYPES } from './TYPES';

export const useTestContainer = () => {
  const container = DI.create();

  afterEach(async () => {
    const cache = container.get<Cache>(TYPES.Cache);
    const db = container.get<Db>(TYPES.Db);

    const updateVideoUrlQueue = container.get<UpdateVideoUrlQueue>(TYPES.UpdateVideoUrlQueue);
    const updateVideoUrlWorker = container.get<UpdateVideoUrlWorker>(TYPES.UpdateVideoUrlWorker);

    await Promise.all([cache.cleanup(), db.cleanup(), updateVideoUrlQueue.drain(), updateVideoUrlWorker.stop()]);
  });

  afterAll(async () => {
    const cache = container.get<Cache>(TYPES.Cache);
    const db = container.get<Db>(TYPES.Db);

    await Promise.all([cache.teardown(), db.teardown()]);
  });

  return container;
};
