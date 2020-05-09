import { getSchema } from './resolvers';
import { createGlobalCtx } from './ctx';
import { getServer } from './server';
import { getConfig, Config } from './config';
import { createWorkers } from './jobs';
import express from 'express';
import { get } from 'lodash';

const dummy = async (config: Config): Promise<void> => {
  const ctx = createGlobalCtx(config);
  const app = express();

  app.get('/', async (req, res) => {
    // db time
    const entries = await (await ctx.db.query('SELECT NOW();')).entries();
    const dbNow = new Date(get(entries.next().value, '[1][0].now'));

    // redis time
    const redisTimes = await ctx.redis.time();
    const redisUs = parseInt(redisTimes[0], 10) * 1000;
    const redisNow = new Date(redisUs);

    res.send(`TEST123, dbNow: ${dbNow}\nredisNow: ${redisNow}`);
  });

  app.listen(config.PORT, () => {
    console.log(`App running at http://localhost:${config.PORT}`);
  });
};

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

if (require.main === module) {
  const config = getConfig(process.env);

  switch (config.ROLE) {
    case 'server':
      server(config);
      break;
    case 'worker':
      worker(config);
      break;
    case 'dummy':
      dummy(config);
      break;
    default:
      throw new TypeError(`config.ROLE not supported: ${config.ROLE}`);
  }
}
