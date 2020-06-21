import { ContainerConfig } from '@stringsync/config';
import { ContainerModule } from 'inversify';
import { TYPES } from '@stringsync/container';
import { UserTypeormRepo, UserRepo } from '@stringsync/repos';

export const getReposModule = (config: ContainerConfig) => {
  return new ContainerModule((bind) => {
    bind<UserRepo>(TYPES.UserRepo).to(UserTypeormRepo);
  });
};
