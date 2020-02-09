import { MAIL_QUEUE } from './constants';
import { Queue, Worker } from 'bullmq';
import Mail from 'nodemailer/lib/mailer';

export type MailQueueData = Mail.Options;

export type Queues = {
  [MAIL_QUEUE]: Queue<MailQueueData>;
};

export interface Workers {
  [MAIL_QUEUE]: Worker;
}
