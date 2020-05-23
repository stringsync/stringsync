import { GlobalCtx } from '../util/ctx';

export const teardown = async (ctx: GlobalCtx) => {
  await ctx.db.drop();
  await ctx.db.close();

  const queues = Object.values(ctx.queues);
  await Promise.all(queues.map((queue) => queue.close()));

  await ctx.redis.flushall();
  await ctx.redis.quit();

  jest.clearAllMocks();
};
