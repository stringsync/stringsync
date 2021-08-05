import { inject, injectable } from 'inversify';
import { Config } from '../../config';
import { TYPES } from '../../inversify.constants';
import { Job } from '../types';
import { sendMail, SendMailPayload } from './../processors';
import { BullMqJob } from './BullMqJob';

@injectable()
export class SendMail {
  readonly job: Job<SendMailPayload>;
  private readonly config: Config;

  constructor(@inject(TYPES.Config) config: Config) {
    this.config = config;
    this.job = new BullMqJob('SEND_MAIL', sendMail, this.config, { attempts: 3 });
  }
}
