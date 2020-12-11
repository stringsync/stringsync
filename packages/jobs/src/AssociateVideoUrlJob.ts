import { inject, injectable } from '@stringsync/di';
import { SERVICES_TYPES, VideoUrlService } from '@stringsync/services';
import { Logger, UTIL_TYPES } from '@stringsync/util';
import { Queue, QueueScheduler, Worker } from 'bullmq';
import { Job } from './Job';
import { JobsConfig } from './JOBS_CONFIG';
import { JOBS_TYPES } from './JOBS_TYPES';
import { JobName } from './types';

const TYPES = { ...SERVICES_TYPES, ...UTIL_TYPES, ...JOBS_TYPES };

@injectable()
export class AssociateVideoUrlJob extends Job {
  constructor(
    @inject(TYPES.VideoUrlService) public videoUrlService: VideoUrlService,
    @inject(TYPES.Logger) public logger: Logger,
    @inject(TYPES.JobsConfig) public config: JobsConfig
  ) {
    super();
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
