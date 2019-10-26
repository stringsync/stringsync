import DataLoader from 'dataloader';
import { createKeyValue, getOrderedDataLoaderValues } from '.';
import { Db } from '../../db/types';

export const createUsersById = (db: Db) =>
  new DataLoader(async (ids: string[]) => {
    const users = await db.models.User.findAll({
      where: { id: ids },
    });
    const userKeyValues = users.map((user) => createKeyValue(user.id, user));
    return getOrderedDataLoaderValues('id', ids, userKeyValues);
  });
