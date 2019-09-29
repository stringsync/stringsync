import DataLoader from 'dataloader';
import { UserModel } from '../models/UserModel';
import { asUserType } from '../casters/user/asUserType';
import { createKeyValue, getOrderedDataLoaderValues } from '.';

export const createUsersById = () =>
  new DataLoader(async (ids: number[]) => {
    const users = await UserModel.findAll({
      where: { id: ids },
      ...asUserType,
    });
    const userKeyValues = users.map((user) => createKeyValue(user.id, user));
    return getOrderedDataLoaderValues('id', ids, userKeyValues);
  });
