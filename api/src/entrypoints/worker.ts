import { Db } from '../db';
import { container } from '../inversify.config';
import { TYPES } from '../inversify.constants';
import { associateVideoUrl, AssociateVideoUrlPayload, BullMqJob, Job, pulseCheck, PulseCheckPayload } from '../jobs';
import { JobServer } from '../server';
import { Logger } from '../util';

const JOBS: Array<Job<any>> = [
  new BullMqJob<AssociateVideoUrlPayload>('ASSOCIATE_VIDEO_URL', associateVideoUrl, { intervalMs: 60000 }),
  new BullMqJob<PulseCheckPayload>('PULSE_CHECK_PAYLOAD', pulseCheck, { intervalMs: 60000 }),
];

(async () => {
  const db = container.get<Db>(TYPES.Db);
  await db.init();

  const logger = container.get<Logger>(TYPES.Logger);
  await Promise.all(JOBS.map((job) => job.start()));

  logger.info('jobs started');

  const server = container.get<JobServer>(TYPES.WorkerServer);
  server.start(JOBS);
})();
