import { Sequelize } from 'sequelize';
import { StaticModels } from './StaticModel';
import { defineUserModel } from './user';

export const defineModels = (sequelize: Sequelize) => {
  const models: StaticModels = {
    User: defineUserModel(sequelize),
  };

  for (const model of Object.values(models)) {
    if (typeof model.associate === 'function') {
      model.associate(models);
    }
  }

  return models;
};
