import { Options, UnderscoreNamingStrategy } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Env } from '../../config/Env';
import { ENTITIES } from './entities';

export const options: Options<PostgreSqlDriver> = {
  type: 'postgresql',
  host: Env.string('DB_HOST').get(),
  port: Env.number('DB_PORT').get(),
  dbName: Env.string('DB_NAME').get(),
  user: Env.string('DB_USERNAME').get(),
  password: Env.string('DB_PASSWORD').get(),
  validate: true,
  strict: true,
  namingStrategy: UnderscoreNamingStrategy,
  entities: ENTITIES,
  migrations: {
    tableName: 'migrations',
    path: './src/db/mikro-orm/migrations',
    pattern: /^Migration\d+-?.*\.ts$/,
  },
};

export default options;
