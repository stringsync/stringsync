import { Handler } from './types';

export const checkHealth: Handler = (ctx) => async (req, res) => {
  await ctx.db.query('SELECT NOW();');
  await ctx.redis.time();
  ctx.logger.info('health check succeeded');
  res.send('ok');
};
