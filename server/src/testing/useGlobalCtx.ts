import { GlobalCtx, createGlobalCtx } from '../util/ctx';
import { Config, getConfig } from '../config';
import { ForcedRollback } from '../data/db';

type Callback = <R>(ctx: GlobalCtx) => R;

const DEFAULT_CONFIG = getConfig(process.env);

export const useGlobalCtx = async (
  callback: Callback,
  config: Config = DEFAULT_CONFIG
) => {
  const ctx = createGlobalCtx(config);

  try {
    await ctx.db.transaction(async () => {
      await callback(ctx);
      throw new ForcedRollback();
    });
  } catch (e) {
    await ctx.db.sequelize.close();

    const queues = Object.values(ctx.queues);
    await Promise.all(queues.map((queue) => queue.close()));

    await ctx.redis.quit();

    if (!(e instanceof ForcedRollback)) {
      throw e;
    }
  }
};
