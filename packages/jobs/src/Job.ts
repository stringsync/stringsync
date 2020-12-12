import { UnknownError } from '@stringsync/common';
import { injectable } from '@stringsync/di';
import { JobsOptions, Queue, QueueScheduler, Worker } from 'bullmq';
import * as uuid from 'uuid';

@injectable()
export abstract class Job<T = undefined> {
  private queue: Queue<T> | null = null;
  private worker: Worker<T> | null = null;
  private scheduler: QueueScheduler | null = null;

  protected abstract createQueue(): Queue<T>;
  protected abstract createWorker(): Worker<T>;
  protected abstract createScheduler(): QueueScheduler | null;

  setupWorker() {
    if (!this.scheduler) {
      this.scheduler = this.createScheduler();
    }
    if (!this.worker) {
      this.worker = this.createWorker();
    }
  }

  setupQueue() {
    if (!this.queue) {
      this.queue = this.createQueue();
    }
  }

  async teardownWorker() {
    const promises = [];

    if (this.scheduler) {
      promises.push(this.scheduler.close());
    }
    if (this.worker) {
      promises.push(this.worker.close());
    }

    await Promise.all(promises);

    this.scheduler = null;
    this.worker = null;
  }

  async teardownQueue() {
    if (this.queue) {
      await this.queue.close();
    }
  }

  async enqueue(data: T, opts?: JobsOptions) {
    if (!this.queue) {
      throw new UnknownError(`must setup queue first`);
    }
    const jobId = await this.getJobId();
    this.queue.add(jobId, data, opts);
  }

  protected async getJobId() {
    let jobId = uuid.v4();
    while (await this.exists(jobId)) {
      jobId = uuid.v4();
    }
    return jobId;
  }

  private async exists(jobId: string) {
    if (!this.queue) {
      throw new UnknownError(`must setup queue first`);
    }
    const job = await this.queue.getJob(jobId);
    return typeof job !== 'undefined';
  }
}
