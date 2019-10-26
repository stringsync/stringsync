import { Sequelize, Transaction } from 'sequelize';
import { UserModelStatic } from './models/defineUserModel';
import { UserSessionModelStatic } from './models/defineUserSessionModel';

export type Db = Sequelize & {
  models: {
    User: UserModelStatic;
    UserSession: UserSessionModelStatic;
  };
};

export type DataAccessor<T, A> = (
  db: Db,
  args: A,
  transaction?: Transaction
) => Promise<T>;
