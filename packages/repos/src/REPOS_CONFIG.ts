import { configFactory, NODE_ENV } from '@stringsync/config';

export const REPOS_CONFIG = configFactory({
  NODE_ENV: NODE_ENV,
});

export type ReposConfig = ReturnType<typeof REPOS_CONFIG>;
