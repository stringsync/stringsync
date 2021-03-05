import { Db } from '../db';
import { container } from '../inversify.config';
import { TYPES } from '../inversify.constants';
import { generateSchema } from '../resolvers';
import { Server } from '../server';

(async () => {
  const db = container.get<Db>(TYPES.Db);
  await db.init();
  const schema = generateSchema();
  const server = container.get<Server>(TYPES.Server);
  server.start(schema);
})();
