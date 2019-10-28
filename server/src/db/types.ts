import { Sequelize, Transaction } from 'sequelize';
import { UserModelStatic } from './models/defineUserModel';
import { UserSessionModelStatic } from './models/defineUserSessionModel';

export type Db = Sequelize & {
  models: {
    User: UserModelStatic;
    UserSession: UserSessionModelStatic;
  };
};

export type DbAccessor<T, A> = (
  db: Db,
  transaction: Transaction | undefined,
  args: A
) => Promise<T>;
