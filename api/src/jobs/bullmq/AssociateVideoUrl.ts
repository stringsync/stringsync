import { inject, injectable } from 'inversify';
import { Config } from '../../config';
import { TYPES } from '../../inversify.constants';
import { Job } from '../types';
import { associateVideoUrl, AssociateVideoUrlPayload } from './../processors';
import { BullMqJob } from './BullMqJob';

@injectable()
export class AssociateVideoUrl {
  readonly job: Job<AssociateVideoUrlPayload>;
  private readonly config: Config;

  constructor(@inject(TYPES.Config) config: Config) {
    this.config = config;
    this.job = new BullMqJob('ASSOCIATE_VIDEO_URL', associateVideoUrl, this.config, { intervalMs: 60000 });
  }
}
