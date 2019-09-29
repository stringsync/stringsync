import DataLoader from 'dataloader';
import { createKeyValue, getOrderedDataLoaderValues } from '.';

export const createNotationsByUserId = () =>
  new DataLoader(async (userIds: number[]) => {
    const notationKeyValues = userIds.map((userId) =>
      createKeyValue(userId, [{ id: userId }])
    );
    return getOrderedDataLoaderValues('userId', userIds, notationKeyValues);
  });
