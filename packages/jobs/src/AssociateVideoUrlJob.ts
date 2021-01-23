import { inject, injectable } from '@stringsync/di';
import { SERVICES_TYPES, VideoUrlService } from '@stringsync/services';
import { Logger, UTIL_TYPES } from '@stringsync/util';
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
    super(config);
  }

  getJobName() {
    return JobName.UPDATE_VIDEO_URL;
  }

  async process() {
    await this.videoUrlService.processNextMessage();
  }
}
