import DataLoader from 'dataloader';
import { createUsersById } from './createUsersById';
import { NotationType } from '../resolvers/types';
import { createNotationsByUserId } from './createNotationsByUserId';
import { User } from 'common/types';

export interface DataLoaders {
  usersById: DataLoader<number, User>;
  notationsByUserId: DataLoader<number, NotationType[]>;
}

export const createDataLoaders = (): DataLoaders => ({
  usersById: createUsersById(),
  notationsByUserId: createNotationsByUserId(),
});
