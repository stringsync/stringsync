import { defineUserModel } from './defineUserModel';
import { defineUserSessionModel } from './defineUserSessionModel';
import { Sequelize } from 'sequelize';

export const defineModels = (dbConnection: Sequelize) => {
  const User = defineUserModel(dbConnection);
  const UserSession = defineUserSessionModel(dbConnection);

  UserSession.belongsTo(User, { foreignKey: 'user_id' });
  User.hasMany(UserSession);
};
