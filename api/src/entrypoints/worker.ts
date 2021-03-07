import { container } from '../inversify.config';
import { TYPES } from '../inversify.constants';
import { associateVideoUrl, AssociateVideoUrlPayload, BullMqJob, Job, pulseCheck, PulseCheckPayload } from '../jobs';
import { Logger } from '../util';

const JOBS: Array<Job<any>> = [
  new BullMqJob<AssociateVideoUrlPayload>('ASSOCIATE_VIDEO_URL', associateVideoUrl, { intervalMs: 60000 }),
  new BullMqJob<PulseCheckPayload>('PULSE_CHECK_PAYLOAD', pulseCheck, { intervalMs: 60000 }),
];

(async () => {
  const logger = container.get<Logger>(TYPES.Logger);

  await Promise.all(JOBS.map((job) => job.start()));

  logger.info('jobs started');
})();
