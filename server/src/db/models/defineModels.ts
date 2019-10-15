import { defineUserModel, UserModelStatic } from './UserModel';
import { Sequelize } from 'sequelize/types';

export interface ModelMap {
  User: UserModelStatic;
}

export const defineModels = (dbConnection: Sequelize): ModelMap => ({
  User: defineUserModel(dbConnection),
});
