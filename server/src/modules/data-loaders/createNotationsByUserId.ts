import DataLoader from 'dataloader';
import { createKeyValue, getOrderedDataLoaderValues } from '.';
import { Db } from '../../db/createDb';

export const createNotationsByUserId = (db: Db) =>
  new DataLoader(async (userIds: string[]) => {
    const notationKeyValues = userIds.map((userId) =>
      createKeyValue(userId, [{ id: userId }])
    );
    return getOrderedDataLoaderValues('userId', userIds, notationKeyValues);
  });
