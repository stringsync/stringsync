import { Container, Pkg } from '@stringsync/di';
import { SERVICES } from '@stringsync/services';
import { UTIL } from '@stringsync/util';
import { JobsConfig, JOBS_CONFIG } from './JOBS_CONFIG';
import { JOBS_TYPES } from './JOBS_TYPES';
import { UpdateVideoUrlJob } from './UpdateVideoUrlJob';

const TYPES = { ...JOBS_TYPES };

export const JOBS: Pkg = {
  name: 'JOBS',
  deps: [UTIL, SERVICES],
  bindings: async (bind) => {
    const config = JOBS_CONFIG();
    bind<JobsConfig>(TYPES.JobsConfig).toConstantValue(config);

    bind<UpdateVideoUrlJob>(TYPES.UpdateVideoUrlJob)
      .to(UpdateVideoUrlJob)
      .inSingletonScope();
  },
  teardown: async (container: Container) => {
    const jobs = [container.get<UpdateVideoUrlJob>(TYPES.UpdateVideoUrlJob)];
    await Promise.all(jobs.map((job) => job.teardown()));
  },
};
