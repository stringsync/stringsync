import { Sequelize } from 'sequelize';
import { UserModelStatic } from './models/UserModel';
import { UserSessionModelStatic } from './models/UserSessionModel';

export type Db = Sequelize & {
  models: {
    User: UserModelStatic;
    UserSession: UserSessionModelStatic;
  };
};
