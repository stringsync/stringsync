import { Queue, QueueScheduler, RedisOptions, Worker } from 'bullmq';
import { isNumber } from 'lodash';
import * as uuid from 'uuid';
import { Config } from '../../config';
import { Job, JobName, JobOpts, Payload, Processor } from '../types';

export class BullMqJob<P extends Payload> implements Job<P> {
  private worker?: Worker<P>;
  private queue?: Queue<P>;
  private scheduler?: QueueScheduler;

  constructor(public name: JobName, public process: Processor<P>, public opts: JobOpts, private config: Config) {}

  async start(): Promise<void> {
    const worker = this.getWorker(); // creating the worker starts it
    const scheduler = this.getScheduler(); // creating the scheduler starts it
    const queue = this.getQueue() as Queue<any>;

    if (isNumber(this.opts.intervalMs)) {
      const name = this.getRepeatTaskName();
      await queue.add(name, undefined, { repeat: { every: this.opts.intervalMs } });
    }
  }

  async stop(): Promise<void> {
    const promises = new Array<Promise<void>>();

    if (this.worker) {
      promises.push(this.worker.close());
    }
    if (this.scheduler) {
      promises.push(this.scheduler.close());
    }
    if (this.queue) {
      promises.push(this.queue.close());
    }

    await Promise.all(promises);

    this.worker = undefined;
    this.scheduler = undefined;
    this.queue = undefined;
  }

  async enqueue(payload: P): Promise<void> {
    const queue = this.getQueue();
    const name = this.getTaskName();
    await queue.add(name, payload);
  }

  private getConnection(): RedisOptions {
    return {
      host: this.config.REDIS_HOST,
      port: this.config.REDIS_PORT,
    };
  }

  private getQueue(): Queue<P> {
    if (!this.queue) {
      this.queue = new Queue<P>(this.name, { connection: this.getConnection() });
    }
    return this.queue;
  }

  private getWorker(): Worker<P> {
    if (!this.worker) {
      this.worker = new Worker<P>(
        this.name,
        async (job) => {
          await this.process(job.data);
        },
        { connection: this.getConnection() }
      );
    }
    return this.worker;
  }

  private getScheduler(): QueueScheduler {
    if (!this.scheduler) {
      this.scheduler = new QueueScheduler(this.name, { connection: this.getConnection() });
    }
    return this.scheduler;
  }

  private getTaskName(): string {
    return uuid.v4();
  }

  private getRepeatTaskName(): string {
    return `${this.name}:repeat`;
  }
}
