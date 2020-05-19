import { defineUserModel } from './user';
import { defineUserSessionModel } from './user-session';
import { Sequelize } from 'sequelize';

export const defineModels = (dbConnection: Sequelize) => {
  const User = defineUserModel(dbConnection);
  const UserSession = defineUserSessionModel(dbConnection);

  UserSession.belongsTo(User, { foreignKey: 'user_id' });
  User.hasMany(UserSession);
};
