import express from 'express';
import cors from 'cors';
import graphqlHTTP from 'express-graphql';
import { GlobalCtx } from '../util/ctx';
import { GraphQLSchema } from 'graphql';
import cookieParser from 'cookie-parser';

export const getApp = (ctx: GlobalCtx, schema: GraphQLSchema) => {
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

  app.use(cookieParser());

  app.use(
    '/graphql',
    graphqlHTTP({
      schema,
      graphiql: true,
    })
  );

  return app;
};
