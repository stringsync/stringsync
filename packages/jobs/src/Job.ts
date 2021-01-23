import { injectable } from '@stringsync/di';
import { ConnectionOptions, JobsOptions, Queue, QueueScheduler, Worker } from 'bullmq';
import * as uuid from 'uuid';
import { JobsConfig } from './JOBS_CONFIG';
import { JOBS_TYPES } from './JOBS_TYPES';
import { JobName } from './types';

const TYPES = { ...JOBS_TYPES };

@injectable()
export abstract class Job<T = undefined> {
  private queue: Queue<T> | null = null;
  private worker: Worker<T> | null = null;
  private scheduler: QueueScheduler | null = null;
  private connection: ConnectionOptions;

  constructor(config: JobsConfig) {
    this.connection = { host: config.REDIS_HOST, port: config.REDIS_PORT };
  }

  abstract getJobName(): JobName;
  abstract process(): Promise<void>;

  async enqueue(data: T, opts?: JobsOptions) {
    const [queue] = this.ensureQueue();
    await queue.add(this.getJobId(), data, opts);
  }

  async work() {
    this.ensureWorker();
  }

  async teardown() {
    const promises = [];

    if (this.queue) {
      promises.push(this.queue.close());
    }
    if (this.scheduler) {
      promises.push(this.scheduler.close());
    }
    if (this.worker) {
      promises.push(this.worker.close());
    }

    await Promise.all(promises);

    this.queue = null;
    this.scheduler = null;
    this.worker = null;
  }

  private getJobId() {
    return uuid.v4();
  }

  private ensureQueue(): [Queue<T>] {
    if (!this.queue) {
      this.queue = new Queue<T>(this.getJobName(), { connection: this.connection });
    }
    return [this.queue];
  }

  private ensureWorker(): [Worker<T>, QueueScheduler] {
    if (!this.scheduler) {
      this.scheduler = new QueueScheduler(this.getJobName(), { connection: this.connection });
    }
    if (!this.worker) {
      this.worker = new Worker<T>(this.getJobName(), this.process, { connection: this.connection });
    }
    return [this.worker, this.scheduler];
  }
}
