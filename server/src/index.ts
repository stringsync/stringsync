import { getConfig, Config } from './config';
import { createGlobalCtx } from './util/ctx';
import { getApp } from './app';
import { createWorkers } from './jobs';

const server = async (config: Config): Promise<void> => {
  const ctx = createGlobalCtx(config);
  const app = getApp(ctx);
  await app.listen(config.PORT);
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
