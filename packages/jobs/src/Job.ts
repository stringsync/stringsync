import { injectable } from '@stringsync/di';
import { Job as BullmqJob, JobsOptions, Queue, QueueBaseOptions, QueueScheduler, Worker } from 'bullmq';
import * as uuid from 'uuid';
import { JobsConfig } from './JOBS_CONFIG';
import { JobName } from './types';

@injectable()
export abstract class Job<T> {
  private queue: Queue<T> | null = null;
  private worker: Worker<T> | null = null;
  private scheduler: QueueScheduler | null = null;
  private baseOpts: QueueBaseOptions;

  constructor(public config: JobsConfig) {
    this.baseOpts = { connection: { host: config.REDIS_HOST, port: config.REDIS_PORT } };
  }

  abstract name: JobName;
  abstract isEternal: boolean;
  protected abstract perform(data: T): Promise<void>;

  async enqueue(data: T, opts?: JobsOptions) {
    if (!this.queue) {
      this.queue = new Queue<T>(this.name, this.baseOpts);
    }
    if (!this.scheduler) {
      this.scheduler = new QueueScheduler(this.name, this.baseOpts);
    }
    await this.queue.add(this.getJobId(), data, opts);
  }

  work = async () => {
    if (!this.worker) {
      this.worker = new Worker<T>(
        this.name,
        async (job: BullmqJob<T>) => {
          await this.perform(job.data);
        },
        this.baseOpts
      );
    }
  };

  async teardown() {
    const promises = new Array<Promise<any>>();
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

  protected getJobId(): string {
    return this.isEternal ? this.name : uuid.v4();
  }
}
