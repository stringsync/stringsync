import DataLoader from 'dataloader';
import { batcGetUsersFromIds } from './users';
import { batchGetNotationsFromUserIds } from './notations';
import { User, Notation } from 'common/types';
import { Db } from '../../db';

export interface DataLoaders {
  usersById: DataLoader<string, User>;
  notationsByUserId: DataLoader<string, Notation[]>;
}

export const createDataLoaders = (db: Db): DataLoaders => ({
  usersById: new DataLoader(batcGetUsersFromIds(db)),
  notationsByUserId: new DataLoader(batchGetNotationsFromUserIds(db)),
});
