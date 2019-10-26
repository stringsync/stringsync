import { Db } from '../types';

export type DataAccessor<T, A> = (db: Db, args?: any) => Promise<T>;
