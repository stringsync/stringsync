import DataLoader from 'dataloader';
import { Sequelize } from 'sequelize/types';
import { createUsersById } from './createUsersById';
import { UserType, NotationType } from '../resolvers/types';
import { createNotationsByUserId } from './createNotationsByUserId';

export interface DataLoaders {
  usersById: DataLoader<number, UserType>;
  notationsByUserId: DataLoader<number, NotationType[]>;
}

export const createDataLoaders = (db: Sequelize): DataLoaders => ({
  usersById: createUsersById(),
  notationsByUserId: createNotationsByUserId(),
});
