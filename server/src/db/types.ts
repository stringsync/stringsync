import { Sequelize } from 'sequelize';
import { UserModelStatic } from './models/defineUserModel';
import { UserSessionModelStatic } from './models/defineUserSessionModel';

export type Db = Sequelize & {
  models: {
    User: UserModelStatic;
    UserSession: UserSessionModelStatic;
  };
};
