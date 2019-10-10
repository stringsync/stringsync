import DataLoader from 'dataloader';
import { createUsersById } from './createUsersById';
import { UserType, NotationType } from '../resolvers/types';
import { createNotationsByUserId } from './createNotationsByUserId';

export interface DataLoaders {
  usersById: DataLoader<number, UserType>;
  notationsByUserId: DataLoader<number, NotationType[]>;
}

export const createDataLoaders = (): DataLoaders => ({
  usersById: createUsersById(),
  notationsByUserId: createNotationsByUserId(),
});
