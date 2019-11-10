import { Sequelize } from 'sequelize';
import { UserModelStatic, UserSessionModelStatic } from './models';

export type Db = Sequelize & {
  models: {
    User: UserModelStatic;
    UserSession: UserSessionModelStatic;
  };
};
