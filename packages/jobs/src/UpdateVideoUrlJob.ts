import { inject, injectable } from '@stringsync/di';
import { SERVICES_TYPES, VideoUrlService } from '@stringsync/services';
import { UTIL_TYPES } from '@stringsync/util';
import { Job } from './Job';
import { JobsConfig } from './JOBS_CONFIG';
import { JOBS_TYPES } from './JOBS_TYPES';
import { JobName } from './types';

const TYPES = { ...SERVICES_TYPES, ...UTIL_TYPES, ...JOBS_TYPES };

@injectable()
export class UpdateVideoUrlJob extends Job<undefined> {
  name = JobName.UPDATE_VIDEO_URL;
  isEternal = true;

  constructor(
    @inject(TYPES.VideoUrlService) public videoUrlService: VideoUrlService,
    @inject(TYPES.JobsConfig) public config: JobsConfig
  ) {
    super(config);
  }

  async perform(data: undefined) {
    console.log(new Date());
    await this.videoUrlService.processNextMessage();
  }
}
