import DataLoader from 'dataloader';
import { createKeyValue } from '../createKeyValue';
import { getOrderedDataLoaderValues } from '../getOrderedDataLoaderValues';
import { Db } from '../../../db';

export const notationsByUserId = (db: Db) =>
  new DataLoader(async (userIds: string[]) => {
    const notationKeyValues = userIds.map((userId) =>
      createKeyValue(userId, [{ id: userId }])
    );
    return getOrderedDataLoaderValues('userId', userIds, notationKeyValues);
  });
