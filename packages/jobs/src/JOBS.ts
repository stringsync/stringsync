import { Container, Pkg } from '@stringsync/di';
import { SERVICES } from '@stringsync/services';
import { UTIL } from '@stringsync/util';
import { AssociateVideoUrlJob } from './AssociateVideoUrlJob';
import { Job } from './Job';
import { JobsConfig, JOBS_CONFIG } from './JOBS_CONFIG';
import { JOBS_TYPES } from './JOBS_TYPES';

const TYPES = { ...JOBS_TYPES };

export const JOBS: Pkg = {
  name: 'JOBS',
  deps: [UTIL, SERVICES],
  bindings: async (bind) => {
    const config = JOBS_CONFIG();
    bind<JobsConfig>(TYPES.JobsConfig).toConstantValue(config);

    bind<AssociateVideoUrlJob>(TYPES.AssociateVideoUrlJob)
      .to(AssociateVideoUrlJob)
      .inSingletonScope();
  },
  teardown: async (container: Container) => {
    const jobs: Job[] = [container.get<AssociateVideoUrlJob>(TYPES.AssociateVideoUrlJob)];
    await Promise.all(jobs.map((job) => job.teardown()));
  },
};
