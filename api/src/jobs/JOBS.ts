import { BullMqJob } from './bullmq';
import {
  associateVideoUrl,
  AssociateVideoUrlPayload,
  pulseCheck,
  PulseCheckPayload,
  sendMail,
  SendMailPayload,
} from './processors';

export const JOBS = {
  ASSOCIATE_VIDEO_URL: new BullMqJob<AssociateVideoUrlPayload>('ASSOCIATE_VIDEO_URL', associateVideoUrl, {
    intervalMs: 60000,
  }),
  PULSE_CHECK: new BullMqJob<PulseCheckPayload>('PULSE_CHECK', pulseCheck, { intervalMs: 60000 }),
  SEND_MAIL: new BullMqJob<SendMailPayload>('SEND_MAIL', sendMail, { attempts: 5 }),
};
