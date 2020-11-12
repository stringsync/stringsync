import { ContainerConfig } from '@stringsync/config';
import { TYPES } from '@stringsync/di';
import { Logger, MessageQueue } from '@stringsync/util';
import { Queue, QueueScheduler, Worker } from 'bullmq';
import { inject, injectable } from 'inversify';
import { BaseJob } from './BaseJob';
import { JobName } from './types';

@injectable()
export class UpdateVideoUrlJob extends BaseJob {
  messageQueue: MessageQueue;
  logger: Logger;
  config: ContainerConfig;

  constructor(
    @inject(TYPES.MessageQueue) messageQueue: MessageQueue,
    @inject(TYPES.Logger) logger: Logger,
    @inject(TYPES.ContainerConfig) config: ContainerConfig
  ) {
    super();

    this.messageQueue = messageQueue;
    this.logger = logger;
    this.config = config;
  }

  createQueue() {
    return new Queue(JobName.UPDATE_VIDEO_URL, {
      connection: { host: this.config.REDIS_HOST, port: this.config.REDIS_PORT },
    });
  }

  createScheduler() {
    return new QueueScheduler(JobName.UPDATE_VIDEO_URL, {
      connection: { host: this.config.REDIS_HOST, port: this.config.REDIS_PORT },
    });
  }

  createWorker() {
    return new Worker(
      JobName.UPDATE_VIDEO_URL,
      async () => {
        const message = await this.messageQueue.get('ss-vids-dev');
        if (!message) {
          return;
        }

        this.logger.info(message.body);

        await this.messageQueue.ack(message);
      },
      {
        connection: {
          host: this.config.REDIS_HOST,
          port: this.config.REDIS_PORT,
        },
      }
    );
  }

  async getJobId() {
    return `eternal:${JobName.UPDATE_VIDEO_URL}`;
  }
}
