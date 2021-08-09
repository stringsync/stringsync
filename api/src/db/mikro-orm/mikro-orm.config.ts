import { Options, UnderscoreNamingStrategy } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { config } from '../../config';
import { ENTITIES } from './entities';

export const options: Options<PostgreSqlDriver> = {
  type: 'postgresql',
  host: config.DB_HOST,
  port: config.DB_PORT,
  dbName: config.DB_NAME,
  user: config.DB_USERNAME,
  password: config.DB_PASSWORD,
  validate: true,
  strict: true,
  namingStrategy: UnderscoreNamingStrategy,
  entities: ENTITIES,
};

export default options;
