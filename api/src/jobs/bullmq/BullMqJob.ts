import { Queue, QueueScheduler, RedisOptions, Worker } from 'bullmq';
import { isNumber } from 'lodash';
import * as uuid from 'uuid';
import { Config } from '../../config';
import { container } from '../../inversify.config';
import { TYPES } from '../../inversify.constants';
import { Job, JobOpts, Payload, Processor } from '../types';

export class BullMqJob<P extends Payload> implements Job<P> {
  config: Config = container.get<Config>(TYPES.Config);

  private worker?: Worker<P>;
  private queue?: Queue<P>;
  private scheduler?: QueueScheduler;

  constructor(public name: string, public process: Processor<P>, public opts: JobOpts) {}

  async startWorking(): Promise<void> {
    const queue = this.ensureQueue() as Queue<any>;
    await queue.waitUntilReady();

    const worker = this.ensureWorker();
    await worker.waitUntilReady();

    const scheduler = this.ensureScheduler();
    await scheduler.waitUntilReady();
  }

  async startDispatching(): Promise<void> {
    const queue = this.ensureQueue() as Queue<any>;
    await queue.waitUntilReady();

    const scheduler = this.ensureScheduler();
    await scheduler.waitUntilReady();

    if (isNumber(this.opts.intervalMs)) {
      const name = this.getRepeatTaskName();
      await queue.add(name, {}, { repeat: { every: this.opts.intervalMs } });
    }
  }

  async stop(): Promise<void> {
    const promises = new Array<Promise<void>>();

    if (this.worker) {
      promises.push(this.worker.close());
      promises.push(this.worker.disconnect());
    }
    if (this.scheduler) {
      promises.push(this.scheduler.close());
      promises.push(this.scheduler.disconnect());
    }
    if (this.queue) {
      promises.push(this.queue.close());
      promises.push(this.queue.disconnect());
    }

    await Promise.all(promises);

    this.worker = undefined;
    this.scheduler = undefined;
    this.queue = undefined;
  }

  async enqueue(payload: P): Promise<void> {
    const queue = this.ensureQueue();
    const name = this.getTaskName();
    await queue.add(name, payload);
  }

  async count(): Promise<number> {
    return await this.ensureQueue().count();
  }

  async isHealthy(): Promise<boolean> {
    if (!this.scheduler || !this.worker) {
      return false;
    }
    return this.scheduler.isRunning() && this.worker.isRunning();
  }

  private getConnection(): RedisOptions {
    return {
      host: this.config.REDIS_HOST,
      port: this.config.REDIS_PORT,
      retryStrategy: () => null,
    };
  }

  private ensureQueue(): Queue<P> {
    if (!this.queue) {
      this.queue = new Queue<P>(this.name, { connection: this.getConnection() });
    }
    return this.queue;
  }

  private ensureWorker(): Worker<P> {
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

  private ensureScheduler(): QueueScheduler {
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
