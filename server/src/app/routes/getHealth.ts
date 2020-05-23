import { Handler } from './types';

export const getHealth: Handler = (ctx) => async (req, res) => {
  await ctx.db.sequelize.authenticate();
  await ctx.redis.time();
  ctx.logger.info('health check succeeded');
  res.send('ok');
};
