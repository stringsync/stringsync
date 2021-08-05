import { inject, injectable } from 'inversify';
import { Config } from '../../config';
import { TYPES } from '../../inversify.constants';
import { Job } from '../types';
import { pulseCheck, PulseCheckPayload } from './../processors';
import { BullMqJob } from './BullMqJob';

@injectable()
export class PulseCheck {
  readonly job: Job<PulseCheckPayload>;
  private readonly config: Config;

  constructor(@inject(TYPES.Config) config: Config) {
    this.config = config;
    this.job = new BullMqJob('PULSE_CHECK', pulseCheck, this.config, { intervalMs: 60000 });
  }
}
