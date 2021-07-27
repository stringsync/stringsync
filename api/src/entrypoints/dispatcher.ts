import { Db } from '../db';
import { container } from '../inversify.config';
import { TYPES } from '../inversify.constants';
import { JOBS } from '../jobs';
import { JobServer } from '../server';
import { Logger } from '../util';

(async () => {
  const db = container.get<Db>(TYPES.Db);
  await db.init();

  const logger = container.get<Logger>(TYPES.Logger);
  await Promise.all(JOBS.map((job) => job.startDispatching()));

  logger.info('job dispatcher started');

  const server = container.get<JobServer>(TYPES.WorkerServer);
  server.start(JOBS);
})();
