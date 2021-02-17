import { configFactory } from './configFactory';

export const getJobConfig = configFactory({});

export type JobConfig = ReturnType<typeof getJobConfig>;
