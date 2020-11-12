import { UnknownError } from '@stringsync/common';
import { JobsOptions, Queue, QueueScheduler, Worker } from 'bullmq';
import { injectable } from 'inversify';
import * as uuid from 'uuid';

@injectable()
export abstract class BaseJob<T = void> {
  private _queue: Queue<T> | null = null;
  private _worker: Worker<T> | null = null;
  private _scheduler: QueueScheduler | null = null;

  protected abstract createQueue(): Queue<T>;
  protected abstract createWorker(): Worker<T>;
  protected abstract createScheduler(): QueueScheduler | null;

  setupWorker() {
    if (!this._scheduler) {
      this._scheduler = this.createScheduler();
    }
    if (!this._worker) {
      this._worker = this.createWorker();
    }
  }

  setupQueue() {
    if (!this._queue) {
      this._queue = this.createQueue();
    }
  }

  async teardownWorker() {
    const promises = [];

    if (this._scheduler) {
      promises.push(this._scheduler.close());
    }
    if (this._worker) {
      promises.push(this._worker.close());
    }

    await Promise.all(promises);

    this._scheduler = null;
    this._worker = null;
  }

  async teardownQueue() {
    if (this._queue) {
      await this._queue.close();
    }
  }

  async enqueue(data: T, opts?: JobsOptions) {
    if (!this._queue) {
      throw new UnknownError(`must setup queue first`);
    }
    const jobId = await this.getJobId();
    this._queue.add(jobId, data, opts);
  }

  protected async getJobId() {
    let jobId = uuid.v4();
    while (await this.exists(jobId)) {
      jobId = uuid.v4();
    }
    return jobId;
  }

  private async exists(jobId: string) {
    if (!this._queue) {
      throw new UnknownError(`must setup queue first`);
    }
    const job = await this._queue.getJob(jobId);
    return typeof job !== 'undefined';
  }
}
