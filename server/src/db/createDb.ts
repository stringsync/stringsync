import { Sequelize } from 'sequelize';
import { defineModels } from './models';
import { Db } from './types';

export const createDb = (connection: Sequelize) => {
  defineModels(connection);
  return connection as Db;
};
