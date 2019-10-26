import { Db } from '../types';

export type DatumAccessor<T, A> = (db: Db, args: A) => Promise<T | null>;
export type DataAccessor<T extends T[], A> = (db: Db, args?: any) => Promise<T>;
