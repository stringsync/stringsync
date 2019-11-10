import DataLoader from 'dataloader';
import { batchGetUsersFromIds } from './users';
import { batchGetNotationsFromUserIds } from './notations';
import { Db } from '../db';

export const getDataLoaders = (db: Db) => ({
  usersById: new DataLoader(batchGetUsersFromIds(db)),
  notationsByUserId: new DataLoader(batchGetNotationsFromUserIds(db)),
});
