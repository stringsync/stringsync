import { Repo } from '../types';

export type RepoFactory<T extends object> = () => Repo<T>;

export type Cleanup<T extends object> = (repo: Repo<T>) => Promise<void>;
