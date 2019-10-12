import DataLoader from 'dataloader';
import { UserModel } from '../models/UserModel';
import { asUserPojo } from '../casters/user/asUserPojo';
import { createKeyValue, getOrderedDataLoaderValues } from '.';

export const createUsersById = () =>
  new DataLoader(async (ids: number[]) => {
    const users = await UserModel.findAll({
      where: { id: ids },
      ...asUserPojo,
    });
    const userKeyValues = users.map((user) => createKeyValue(user.id, user));
    return getOrderedDataLoaderValues('id', ids, userKeyValues);
  });
