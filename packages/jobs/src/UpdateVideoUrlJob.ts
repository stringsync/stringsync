import { ContainerConfig } from '@stringsync/config';
import { TYPES } from '@stringsync/di';
import { VideoMessageService } from '@stringsync/services';
import { Logger } from '@stringsync/util';
import { Queue, QueueScheduler, Worker } from 'bullmq';
import { inject, injectable } from 'inversify';
import { BaseJob } from './BaseJob';
import { JobName } from './types';

@injectable()
export class UpdateVideoUrlJob extends BaseJob {
  videoMessageService: VideoMessageService;
  logger: Logger;
  config: ContainerConfig;

  constructor(
    @inject(TYPES.VideoMessageService) videoMessageService: VideoMessageService,
    @inject(TYPES.Logger) logger: Logger,
    @inject(TYPES.ContainerConfig) config: ContainerConfig
  ) {
    super();

    this.videoMessageService = videoMessageService;
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
        this.logger.info('checking for processed video messages');

        await this.videoMessageService.call();
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
