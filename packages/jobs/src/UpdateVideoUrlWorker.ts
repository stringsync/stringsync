import { ConflictError } from '@stringsync/common';
import { TYPES } from '@stringsync/di';
import { Logger } from '@stringsync/util';
import { Job, Worker as _Worker } from 'bullmq';
import { inject, injectable } from 'inversify';
import { Names, UpdateVideoUrlData, Worker } from './types';

@injectable()
export class UpdateVideoUrlWorker implements Worker<UpdateVideoUrlData> {
  logger: Logger;

  private _worker: _Worker<UpdateVideoUrlData> | null = null;

  constructor(@inject(TYPES.Logger) logger: Logger) {
    this.logger = logger;
  }

  start() {
    if (this._worker) {
      return;
    }
    this._worker = new _Worker(Names.UPDATE_VIDEO_URL, async (job: Job<UpdateVideoUrlData>) => {
      await this.process(job.data);
    });
  }

  async stop() {
    if (!this._worker) {
      return;
    }
    await this._worker.close();
    this._worker = null;
  }

  async process(data: UpdateVideoUrlData) {
    if (!this._worker) {
      throw new ConflictError(`worker not started: ${Names.UPDATE_VIDEO_URL}`);
    }
  }
}
