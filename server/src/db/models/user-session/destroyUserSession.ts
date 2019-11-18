import { Db } from '../../types';

export const destroyUserSession = async (db: Db, token: string) => {
  await db.models.UserSession.destroy({ where: { token } });
};
