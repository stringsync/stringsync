import { getSchema } from './resolvers';
import { createGlobalCtx } from './ctx';
import { getServer } from './server';
import { getConfig, Config } from './config';
import { createWorkers } from './jobs';
import express from 'express';

const dummy = async (config: Config): Promise<void> => {
  const app = express();
  app.get('/', (req, res) => res.send('Hello World!'));
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
