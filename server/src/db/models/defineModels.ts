import { defineUserModel, UserModelStatic } from './UserModel';
import {
  defineUserSessionModel,
  UserSessionModelStatic,
} from './UserSessionModel';
import { Sequelize } from 'sequelize';

export interface ModelMap {
  User: UserModelStatic;
  UserSession: UserSessionModelStatic;
}

export const defineModels = (dbConnection: Sequelize): ModelMap => {
  const User = defineUserModel(dbConnection);
  const UserSession = defineUserSessionModel(dbConnection);

  UserSession.belongsTo(User);
  User.hasMany(UserSession);

  return {
    User,
    UserSession,
  };
};
