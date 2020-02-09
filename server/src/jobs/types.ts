import { MAIL_QUEUE } from './constants';
import { Queue, Worker } from 'bullmq';

export interface MailQueueData {
  subject: string;
  body: string;
  email: string;
}

export type Queues = {
  [MAIL_QUEUE]: Queue<MailQueueData>;
};

export interface Workers {
  [MAIL_QUEUE]: Worker;
}
