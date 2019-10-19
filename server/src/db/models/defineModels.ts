import { defineUserModel, UserModelStatic } from './UserModel';
import { defineUserSessionModel, UserSessionStatic } from './UserSessionModel';
import { Sequelize } from 'sequelize';

export interface ModelMap {
  User: UserModelStatic;
  UserSession: UserSessionStatic;
}

export const defineModels = (dbConnection: Sequelize): ModelMap => {
  const User = defineUserModel(dbConnection);
  const UserSession = defineUserSessionModel(dbConnection);

  UserSession.belongsTo(User);

  return {
    User,
    UserSession,
  };
};
