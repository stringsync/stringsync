import { MAIL } from './constants';
import { Queue, Worker } from 'bullmq';
import { MailQueueData } from './processors';

export type Queues = {
  [MAIL]: Queue<MailQueueData>;
};

export interface Workers {
  [MAIL]: Worker;
}
