import { Sequelize } from 'sequelize';
import { defineModels } from './models/defineModels';
import { Db } from './types';

export const createDb = (connection: Sequelize) => {
  defineModels(connection);
  return connection as Db;
};
