import { GlobalCtx } from '../util/ctx';

export const teardown = async (ctx: GlobalCtx) => {
  await ctx.db.sequelize.drop();
  await ctx.db.sequelize.close();

  const queues = Object.values(ctx.queues);
  await Promise.all(queues.map((queue) => queue.close()));

  await ctx.redis.flushall();
  await ctx.redis.quit();

  jest.clearAllMocks();
};
