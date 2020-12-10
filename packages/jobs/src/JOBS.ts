import { configFactory, NODE_ENV, REDIS_HOST, REDIS_PORT } from '@stringsync/config';
import { createContainer, Pkg } from '@stringsync/di';
import { SERVICES } from '@stringsync/services';
import { UTIL } from '@stringsync/util';
import { AssociateVideoUrlJob } from './AssociateVideoUrlJob';

export const JOBS_CONFIG = configFactory({
  NODE_ENV: NODE_ENV,
  REDIS_HOST: REDIS_HOST,
  REDIS_PORT: REDIS_PORT,
});

export type JobsConfig = ReturnType<typeof JOBS_CONFIG>;

export const TYPES = {
  JobsConfig: Symbol('JobsConfig'),
  AssociateVideoUrlJob: Symbol('AssociateVideoUrlJob'),
};

export const JOBS: Pkg<typeof TYPES> = {
  name: 'JOBS',
  TYPES,
  deps: [UTIL, SERVICES],
  bindings: async (bind) => {
    const config = JOBS_CONFIG();
    bind<JobsConfig>(TYPES.JobsConfig).toConstantValue(config);

    bind<AssociateVideoUrlJob>(TYPES.AssociateVideoUrlJob)
      .to(AssociateVideoUrlJob)
      .inSingletonScope();
  },
};

export const createJobsContainer = async () => await createContainer(JOBS);
