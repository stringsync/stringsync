import express from 'express';
import { GlobalCtx } from '../ctx';
import cors from 'cors';

export const getExpressServer = (ctx: GlobalCtx) => {
  const app = express();

  app.use(cors());

  app.get('/health', async (req, res) => {
    try {
      await ctx.db.query('SELECT NOW();');
      await ctx.redis.time();
      ctx.logger.info('health check succeeded');
      res.send('ok');
    } catch {
      ctx.logger.info('health check failed');
      throw new Error('health check failed');
    }
  });

  return app;
};
