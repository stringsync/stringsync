import { CleanupServices } from './types';

export const cleanup = async (services: CleanupServices) => {
  const promises = new Array<Promise<any>>();

  if (services.db) {
    await services.db.close();
  }

  if (services.queues) {
    for (const queue of Object.values(services.queues)) {
      promises.push(queue.close());
    }
  }

  if (services.redis) {
    promises.push(services.redis.flushall());
    promises.push(services.redis.quit());
  }

  await Promise.all(promises);
};
