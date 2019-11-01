import DataLoader from 'dataloader';
import { alignOneToOne } from '../../align';
import { Db } from '../../../db';
import { User } from 'common/types';

export const usersById = (db: Db) =>
  new DataLoader(async (ids: string[]) => {
    const users = (await db.models.User.findAll({
      raw: true,
      where: { id: ids },
    })) as User[];
    return alignOneToOne(ids, users, {
      getKey: (user) => user.id,
      getUniqueIdentifier: (user) => user.id,
    });
  });
