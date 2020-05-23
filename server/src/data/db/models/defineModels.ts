import { defineUserModel } from './user';
import { defineUserSessionModel } from './user-session';
import { Sequelize } from 'sequelize';

export const defineModels = (sequelize: Sequelize) => {
  const models = {
    User: defineUserModel(sequelize),
    UserSession: defineUserSessionModel(sequelize),
  };

  for (const model of Object.values(models)) {
    if (typeof model.associate === 'function') {
      model.associate(models);
    }
  }

  return models;
};
