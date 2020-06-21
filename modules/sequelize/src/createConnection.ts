import { ContainerConfig } from '@stringsync/config';
import { Sequelize } from 'sequelize-typescript';
import path from 'path';

export const createConnection = (config: ContainerConfig) =>
  new Sequelize({
    dialect: 'postgres',
    database: config.DB_NAME,
    username: config.DB_USERNAME,
    password: config.DB_PASSWORD,
    port: config.DB_PORT,
    models: [path.resolve(__dirname, 'models')],
  });
