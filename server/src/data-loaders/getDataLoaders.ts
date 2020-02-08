import DataLoader from 'dataloader';
import { batchGetUsersFromIds } from './users';
import { batchGetNotationsFromUserIds } from './notations';
import { Db } from '../db';
import { DataLoaders } from './types';

export const getDataLoaders = (db: Db): DataLoaders => ({
  usersById: new DataLoader(batchGetUsersFromIds(db)),
  notationsByUserId: new DataLoader(batchGetNotationsFromUserIds(db)),
});
