import { Repo } from '../types';

export type TestRepoConfig<T extends object, R = Repo<T>> = {
  repoFactory: () => R | Promise<R>;
  entityFactory: EntityFactory<T>;
  cleanup: Cleanup<T>;
};

export type Cleanup<T extends object> = (repo: Repo<T>) => Promise<void>;

export type EntityFactory<T extends object> = (attrs?: Partial<T>) => T;
