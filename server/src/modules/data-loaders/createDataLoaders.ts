import DataLoader from 'dataloader';
import { usersById } from './users';
import { notationsByUserId } from './notations';
import { User, Notation } from 'common/types';
import { Db } from '../../db';

export interface DataLoaders {
  usersById: DataLoader<string, User>;
  notationsByUserId: DataLoader<string, Notation[]>;
}

export const createDataLoaders = (db: Db): DataLoaders => ({
  usersById: usersById(db),
  notationsByUserId: notationsByUserId(db),
});
