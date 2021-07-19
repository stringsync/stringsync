import express from 'express';
import { inject, injectable } from 'inversify';
import { Config } from '../../config';
import { HttpStatus } from '../../errors';
import { TYPES } from '../../inversify.constants';
import { Job } from '../../jobs';
import { Logger } from '../../util';
import { JobServer } from '../types';

@injectable()
export class WorkerServer implements JobServer {
  protected app = express();

  constructor(@inject(TYPES.Logger) protected logger: Logger, @inject(TYPES.Config) protected config: Config) {}

  start(jobs: Job<any>[]) {
    this.app.get('/health', async (req, res) => {
      const unhealthyJobNames = await this.getUnhealthyJobNames(jobs);
      const numUnhealthyJobs = unhealthyJobNames.length;

      if (numUnhealthyJobs > 0) {
        this.logger.warn(`found ${unhealthyJobNames} unhealthy jobs: ${unhealthyJobNames.join(', ')}`);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('not ok');
      } else {
        this.logger.info('all jobs are healthy');
        res.send('ok');
      }
    });

    this.app.listen(this.config.PORT, () => {
      this.logger.info(`worker health server running on port: ${this.config.PORT}`);
    });
  }

  private async getUnhealthyJobNames(jobs: Job<any>[]): Promise<string[]> {
    const jobStatuses = await Promise.all(
      jobs.map(async (job) => {
        const isHealthy = await job.isHealthy();
        const name = job.name;
        return { name, isHealthy };
      })
    );

    return jobStatuses.filter((jobStatus) => !jobStatus.isHealthy).map((jobStatus) => jobStatus.name);
  }
}
