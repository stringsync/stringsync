import { createGlobalCtx } from './util/ctx';
import { getApp } from './app';
import { getConfig, Config } from './config';
import { createWorkers } from './jobs';
import { getSchema, getResolvers } from './resolvers';

const server = async (config: Config): Promise<void> => {
  const ctx = createGlobalCtx(config);
  const schema = getSchema();
  const resolvers = getResolvers();
  const server = getApp(ctx, schema, resolvers);

  await server.listen(config.PORT, () => {
    console.log(`running server at port ${config.PORT}`);
  });
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
    default:
      throw new TypeError(`ROLE not supported: ${config.ROLE}`);
  }
}
