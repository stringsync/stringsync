import { GlobalCtx } from '../util/ctx';
import { Transaction } from 'sequelize/types';

export const teardown = async (ctx: GlobalCtx) => {
  const transaction: Transaction = ctx.db.namespace.get('transaction');
  await transaction?.rollback();
  await ctx.db.sequelize.close();

  const queues = Object.values(ctx.queues);
  await Promise.all(queues.map((queue) => queue.close()));

  await ctx.redis.quit();
};
