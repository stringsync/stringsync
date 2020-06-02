import { Config } from '../config';
import { ContainerModule } from 'inversify';
import { TYPES } from '@stringsync/common';
import { UserMemoryRepo, UserSequelizeRepo, UserRepo } from '@stringsync/repos';

export const getReposModule = (config: Config) => {
  return new ContainerModule((bind) => {
    switch (config.NODE_ENV) {
      case 'test':
        bind<UserRepo>(TYPES.UserRepo).to(UserMemoryRepo);
        return;
      default:
        bind<UserRepo>(TYPES.UserRepo).to(UserSequelizeRepo);
        return;
    }
  });
};
