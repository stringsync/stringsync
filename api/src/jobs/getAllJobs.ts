import { Container } from 'inversify';
import { TYPES } from '../inversify.constants';
import { AssociateVideoUrl, PulseCheck, SendMail } from './bullmq';

export const getAllJobs = (container: Container) => [
  container.get<AssociateVideoUrl>(TYPES.AssociateVideoUrl).job,
  container.get<PulseCheck>(TYPES.PulseCheck).job,
  container.get<SendMail>(TYPES.SendMail).job,
];
