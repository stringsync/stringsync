import DataLoader from 'dataloader';
import { createUsersById } from './createUsersById';
import { NotationType } from '../resolvers/types';
import { createNotationsByUserId } from './createNotationsByUserId';
import { User } from 'common/types';
import { Db } from '../db/createDb';

export interface DataLoaders {
  usersById: DataLoader<string, User>;
  notationsByUserId: DataLoader<string, NotationType[]>;
}

export const createDataLoaders = (db: Db): DataLoaders => ({
  usersById: createUsersById(db),
  notationsByUserId: createNotationsByUserId(db),
});
