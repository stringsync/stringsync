import { Config } from '../config';
import { ContainerModule } from 'inversify';
import { TYPES } from '@stringsync/common';
import { UserSequelizeRepo, Db, connectToDb, UserMemoryRepo, Repo } from '@stringsync/repos';
import { User } from '@stringsync/domain';

export const getReposModule = (config: Config) => {
  return new ContainerModule((bind) => {
    switch (config.NODE_ENV) {
      case 'test':
        bind<Repo<User>>(TYPES.UserRepo).to(UserMemoryRepo);
        return;
      default:
        const db = connectToDb({
          databaseName: config.DB_NAME,
          host: config.DB_HOST,
          password: config.DB_PASSWORD,
          username: config.DB_NAME,
          port: parseInt(config.DB_PORT, 10),
          namespaceName: 'transaction',
        });
        bind<Db>(TYPES.Db).toConstantValue(db);
        bind<Repo<User>>(TYPES.UserRepo).to(UserSequelizeRepo);
        return;
    }
  });
};