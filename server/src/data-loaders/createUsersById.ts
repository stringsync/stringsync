import DataLoader from 'dataloader';
import { asUserPojo } from '../db/casters/user/asUserPojo';
import { createKeyValue, getOrderedDataLoaderValues } from '.';
import { Db } from '../db/createDb';

export const createUsersById = (db: Db) =>
  new DataLoader(async (ids: string[]) => {
    const users = await db.models.User.findAll({
      where: { id: ids },
      ...asUserPojo,
    });
    const userKeyValues = users.map((user) => createKeyValue(user.id, user));
    return getOrderedDataLoaderValues('id', ids, userKeyValues);
  });
