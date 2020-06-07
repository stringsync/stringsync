import { createConnection, getConnection } from 'typeorm';
import { ContainerConfig } from '@stringsync/config';
import { SnakeNamingStrategy } from './SnakeNamingStrategy';
import * as entities from './entities';

export const connectToDb = async (config: ContainerConfig) => {
  return await createConnection({
    type: 'postgres',
    host: config.DB_HOST,
    port: config.DB_PORT,
    username: config.DB_USERNAME,
    password: config.DB_PASSWORD,
    database: config.DB_NAME,
    entities: [entities.User],
    synchronize: false,
    logging: false,
    namingStrategy: new SnakeNamingStrategy(),
  });
};
