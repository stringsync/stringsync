import { containerFactory, SyncMod, TYPES } from '@stringsync/di';
import { SERVICES } from '@stringsync/services';
import { AssociateVideoUrlJob } from './AssociateVideoUrlJob';
import { JobsConfig, JOBS_CONFIG } from './config';

export const JOBS = new SyncMod((bind) => {
  const config = JOBS_CONFIG();
  bind<JobsConfig>(TYPES.JobsConfig).toConstantValue(config);

  bind<AssociateVideoUrlJob>(TYPES.AssociateVideoUrlJob)
    .to(AssociateVideoUrlJob)
    .inSingletonScope();
});

export const createJobsContainer = containerFactory(SERVICES);
