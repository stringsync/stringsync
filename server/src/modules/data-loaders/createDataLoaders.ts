import DataLoader from 'dataloader';
import { createUsersById } from './createUsersById';
import { createNotationsByUserId } from './createNotationsByUserId';
import { User, Notation } from 'common/types';
import { Db } from '../../db/createDb';

export interface DataLoaders {
  usersById: DataLoader<string, User>;
  notationsByUserId: DataLoader<string, Notation[]>;
}

export const createDataLoaders = (db: Db): DataLoaders => ({
  usersById: createUsersById(db),
  notationsByUserId: createNotationsByUserId(db),
});
