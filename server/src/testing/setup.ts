import { GlobalCtx, createGlobalCtx } from '../util/ctx';
import { getConfig } from '../config';

export const setup = async (): Promise<GlobalCtx> => {
  const config = getConfig(process.env);
  const ctx = createGlobalCtx(config);
  await ctx.db.sequelize.sync();
  return ctx;
};
