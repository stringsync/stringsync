import { ContainerConfig } from '@stringsync/config';
import { TYPES } from '@stringsync/di';
import { VideoUrlService } from '@stringsync/services';
import { Logger } from '@stringsync/util';
import { Queue, QueueScheduler, Worker } from 'bullmq';
import { inject, injectable } from 'inversify';
import { Job } from './Job';
import { JobName } from './types';

@injectable()
export class UpdateVideoUrlJob extends Job {
  videoUrlService: VideoUrlService;
  logger: Logger;
  config: ContainerConfig;

  constructor(
    @inject(TYPES.VideoUrlService) videoUrlService: VideoUrlService,
    @inject(TYPES.Logger) logger: Logger,
    @inject(TYPES.ContainerConfig) config: ContainerConfig
  ) {
    super();

    this.videoUrlService = videoUrlService;
    this.logger = logger;
    this.config = config;
  }

  async runForever() {
    await this.enqueue(undefined, {
      repeat: {
        every: 60000, // milliseconds
      },
    });
  }

  protected createQueue() {
    return new Queue(JobName.UPDATE_VIDEO_URL, {
      connection: { host: this.config.REDIS_HOST, port: this.config.REDIS_PORT },
    });
  }

  protected createScheduler() {
    return new QueueScheduler(JobName.UPDATE_VIDEO_URL, {
      connection: { host: this.config.REDIS_HOST, port: this.config.REDIS_PORT },
    });
  }

  protected createWorker() {
    return new Worker(
      JobName.UPDATE_VIDEO_URL,
      async () => {
        await this.videoUrlService.processNextMessage();
      },
      {
        connection: {
          host: this.config.REDIS_HOST,
          port: this.config.REDIS_PORT,
        },
      }
    );
  }

  protected async getJobId() {
    return `eternal:${JobName.UPDATE_VIDEO_URL}`;
  }
}
