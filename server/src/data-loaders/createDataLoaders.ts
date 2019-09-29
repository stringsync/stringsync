import DataLoader from 'dataloader';
import { Sequelize } from 'sequelize/types';
import { createKeyValue, getOrderedDataLoaderValues } from '.';
import { createUsersById } from './createUsersById';
import { UserType, NotationType } from '../resolvers/types';

export interface DataLoaders {
  usersById: DataLoader<number, UserType>;
  notationsByUserId: DataLoader<number, NotationType[]>;
}

// TODO(jared) shard this into multiple files if this mapping becomes too big
export const createDataLoaders = (db: Sequelize): DataLoaders => ({
  usersById: createUsersById(),
  notationsByUserId: new DataLoader(async (userIds) => {
    const notationKeyValues = userIds.map((userId) =>
      createKeyValue(userId, [{ id: userId }])
    );
    return getOrderedDataLoaderValues('userId', userIds, notationKeyValues);
  }),
});
