import { createContainer, Pkg } from '@stringsync/di';
import { SERVICES } from '@stringsync/services';
import { UTIL } from '@stringsync/util';
import { AssociateVideoUrlJob } from './AssociateVideoUrlJob';
import { JobsConfig, JOBS_CONFIG } from './JOBS_CONFIG';
import { JOBS_TYPES } from './JOBS_TYPES';

export const JOBS: Pkg = {
  name: 'JOBS',
  deps: [UTIL, SERVICES],
  bindings: async (bind) => {
    const config = JOBS_CONFIG();
    bind<JobsConfig>(JOBS_TYPES.JobsConfig).toConstantValue(config);

    bind<AssociateVideoUrlJob>(JOBS_TYPES.AssociateVideoUrlJob)
      .to(AssociateVideoUrlJob)
      .inSingletonScope();
  },
};

export const createJobsContainer = async () => await createContainer(JOBS);
