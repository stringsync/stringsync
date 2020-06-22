import { UserModel, TagModel, TaggingModel, NotationModel } from './models';
import { ContainerConfig } from '@stringsync/config';
import { Sequelize } from 'sequelize-typescript';

export const connectToDb = (config: ContainerConfig) =>
  new Sequelize({
    dialect: 'postgres',
    host: config.DB_HOST,
    port: config.DB_PORT,
    database: config.DB_NAME,
    username: config.DB_USERNAME,
    password: config.DB_PASSWORD,
    models: [UserModel, NotationModel, TaggingModel, TagModel],
  });
