import { JobConfig } from '@stringsync/config/src/getJobConfig';
import { TYPES } from '@stringsync/di';
import { Queue as _Queue } from 'bullmq';
import { inject, injectable } from 'inversify';
import * as uuid from 'uuid';
import { Names, Queue, UpdateVideoUrlData } from './types';

@injectable()
export class UpdateVideoUrlQueue implements Queue<UpdateVideoUrlData> {
  private queue: _Queue<UpdateVideoUrlData>;

  constructor(@inject(TYPES.JobConfig) config: JobConfig) {
    this.queue = new _Queue<UpdateVideoUrlData>(Names.UPDATE_VIDEO_URL, {
      connection: { host: config.REDIS_HOST, port: config.REDIS_PORT },
    });
  }

  enqueue(data: UpdateVideoUrlData) {
    this.queue.add(uuid.v4(), data);
  }

  async drain() {
    await this.queue.drain();
  }
}
