import { JobsOptions, Queue, Worker } from 'bullmq';
import * as uuid from 'uuid';

export abstract class BaseJob<T = void> {
  private _queue: Queue<T> | null = null;
  private _worker: Worker<T> | null = null;

  abstract createQueue(): Queue<T>;
  abstract createWorker(): Worker<T>;

  async watch() {
    this.worker.resume();
  }

  async enqueue(data: T, opts?: JobsOptions) {
    const jobId = await this.getNewJobId();
    this.queue.add(jobId, data, opts);
  }

  async teardown() {
    const promises = [];
    if (this._queue) {
      promises.push(this._queue.close());
    }
    if (this._worker) {
      promises.push(this._worker.close());
    }
    await Promise.all(promises);
    this._queue = null;
    this._worker = null;
  }

  protected get queue(): Queue<T> {
    if (!this._queue) {
      this._queue = this.createQueue();
    }
    return this._queue;
  }

  protected get worker(): Worker<T> {
    if (!this._worker) {
      this._worker = this.createWorker();
    }
    return this._worker;
  }

  private async getNewJobId() {
    let jobId = uuid.v4();
    while (await this.exists(jobId)) {
      jobId = uuid.v4();
    }
    return jobId;
  }

  private async exists(jobId: string) {
    const job = await this.queue.getJob(jobId);
    return typeof job !== 'undefined';
  }
}
