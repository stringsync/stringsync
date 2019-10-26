import { Sequelize } from 'sequelize';
import { defineModels } from './models';
import { Db } from './types';
import { createDbConnection } from './createDbConnection';
import { getConfig } from '../modules/config';

export const createDb = (connection?: Sequelize) => {
  // create a connection using the config if one if not explicitly provided
  connection = connection || createDbConnection(getConfig(process.env));
  defineModels(connection);
  return connection as Db;
};
