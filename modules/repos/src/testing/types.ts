import { Repo } from '../types';

export type TestRepoConfig<T extends object> = {
  repoFactory: RepoFactory<T>;
  entityFactory: EntityFactory<T>;
  cleanup: Cleanup<T>;
};

export type RepoFactory<T extends object> = () => Repo<T>;

export type Cleanup<T extends object> = (repo: Repo<T>) => Promise<void>;

export type EntityFactory<T extends object> = () => T;
