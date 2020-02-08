import { getSchema } from './resolvers';
import { createGlobalCtx } from './ctx';
import { getServer } from './server';
import { getConfig } from './config';

const main = async (): Promise<void> => {
  // create global ctx
  const config = getConfig(process.env);
  const ctx = createGlobalCtx(config);

  // create server
  const schema = getSchema();
  const server = getServer(schema, ctx);

  // run server
  await server.listen(config.PORT);
};

if (require.main === module) {
  main();
}
