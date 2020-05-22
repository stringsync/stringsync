import { GlobalCtx } from '../util/ctx';

export const teardown = async (ctx: GlobalCtx) => {
  const promises = new Array<Promise<any>>();

  promises.push(ctx.db.close());

  for (const queue of Object.values(ctx.queues)) {
    promises.push(queue.close());
  }

  promises.push(ctx.redis.flushall());
  promises.push(ctx.redis.quit());

  await Promise.all(promises);
};
