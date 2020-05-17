import { getSchema } from './resolvers';
import { createGlobalCtx } from './ctx';
import { getServer } from './server';
import { getConfig, Config } from './config';
import { createWorkers } from './jobs';
import express from 'express';

const server = async (config: Config): Promise<void> => {
  const ctx = createGlobalCtx(config);
  const schema = getSchema();
  const server = getServer(schema, ctx);
  await server.listen(config.PORT);
};

const worker = (config: Config): void => {
  const ctx = createGlobalCtx(config);
  createWorkers(ctx);
};

const serverExpress = (config: Config): void => {
  const ctx = createGlobalCtx(config);
  const app = express();

  app.get('/', (req, res) => {
    ctx.logger.info('testing logs');
    res.send('hello again, world!');
  });

  app.get('/health', async (req, res) => {
    await ctx.db.query('SELECT NOW();');
    await ctx.redis.time();
    res.send('ok');
  });

  app.listen(config.PORT, () => {
    console.log(`app running at http://localhost:${config.PORT}`);
  });
};

if (require.main === module) {
  const config = getConfig(process.env);

  switch (config.ROLE) {
    case 'server':
      server(config);
      break;
    case 'worker':
      worker(config);
      break;
    case 'server-express':
      serverExpress(config);
      break;
    default:
      throw new TypeError(`config.ROLE not supported: ${config.ROLE}`);
  }
}
