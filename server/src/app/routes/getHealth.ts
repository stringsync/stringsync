import { Handler } from './types';

export const getHealth: Handler = (gctx) => async (req, res) => {
  await gctx.db.sequelize.authenticate();
  await gctx.redis.time();
  gctx.logger.info('health check succeeded');
  res.send('ok');
};
