import DataLoader from 'dataloader';
import { createKeyValue } from '../createKeyValue';
import { getOrderedDataLoaderValues } from '../getOrderedDataLoaderValues';
import { Db } from '../../../db';

export const usersById = (db: Db) =>
  new DataLoader(async (ids: string[]) => {
    const users = await db.models.User.findAll({
      where: { id: ids },
    });
    const userKeyValues = users.map((user) => createKeyValue(user.id, user));
    return getOrderedDataLoaderValues('id', ids, userKeyValues);
  });
