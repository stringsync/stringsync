import express from 'express';
import { inject, injectable } from 'inversify';
import { Config } from '../../config';
import { TYPES } from '../../inversify.constants';
import { Logger } from '../../util';
import { Server } from '../types';

@injectable()
export class WorkerServer implements Server {
  protected app = express();

  constructor(@inject(TYPES.Logger) protected logger: Logger, @inject(TYPES.Config) protected config: Config) {}

  start() {
    this.app.get('/health', async (req, res) => {
      res.send('ok');
    });

    this.app.listen(this.config.PORT, () => {
      this.logger.info(`worker health server running on port: ${this.config.PORT}`);
    });
  }
}
