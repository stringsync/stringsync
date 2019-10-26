import { defineUserModel } from './defineUserModel';
import { defineUserSessionModel } from './defineUserSessionModel';
import { Sequelize } from 'sequelize';

export const defineModels = (dbConnection: Sequelize) => {
  const User = defineUserModel(dbConnection);
  const UserSession = defineUserSessionModel(dbConnection);

  UserSession.belongsTo(User);
  User.hasMany(UserSession);
};
