import { Sequelize } from 'sequelize';
import { ModelMap } from './models/defineModels';
import { defineModels } from './models/defineModels';

export interface Db {
  connection: Sequelize;
  models: ModelMap;
}

export const createDb = (connection: Sequelize): Db => {
  return {
    connection,
    models: defineModels(connection),
  };
};
