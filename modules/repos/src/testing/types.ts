import { Repo } from '../types';

export type RepoFactory<T> = () => Repo<T>;

export type Cleanup<T> = (repo: Repo<T>) => Promise<void>;
