import { BullMqJob } from './bullmq';
import { associateVideoUrl, AssociateVideoUrlPayload, pulseCheck, PulseCheckPayload } from './processors';
import { Job } from './types';

export const JOBS: Array<Job<any>> = [
  new BullMqJob<AssociateVideoUrlPayload>('ASSOCIATE_VIDEO_URL', associateVideoUrl, { intervalMs: 60000 }),
  new BullMqJob<PulseCheckPayload>('PULSE_CHECK_PAYLOAD', pulseCheck, { intervalMs: 60000 }),
];
