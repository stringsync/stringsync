import { Db } from '../../types';

export const destroyUserSession = async (db: Db, id: number) => {
  await db.models.UserSession.destroy({ where: { id } });
};
